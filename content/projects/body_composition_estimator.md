+++
title = "Body Composition Estimator"
description = "Using AI to estimate weight from progress photos"
tags = [
"Python",
"Machine Learning",
"Personal Project",
"Google Gemini"
]
date = 2025-01-16
author = "James Abdy"
+++

<img class="center" style="width:600px" src="/img/body_composition_estimator/header.jpg">

I have years of progress (more accurately regression) photos from fitness tracking, along with corresponding weight measurements. I wanted to see if AI could estimate body weight and composition just from looking at these images, and how accurate those estimates would be compared to ground truth.

This turned into a fun project combining Google's Gemini API, a locally trained CNN, and MediaPipe for pose detection. I had been thinking about doing this for a while but Claude Code helped me finally get around to it (and write this article). 

## The Dataset

I had about 72 progress photos spanning 2016 to 2024 and a CSV of weight measurements over the years that I could match to photo dates.

The weight range in my dataset spans about 30 lbs.

## Smart Cropping with MediaPipe

Raw photos had varying framing, and older photos were stored with incorrect EXIF rotation. Before training any models, I built a preprocessing pipeline using MediaPipe's pose detection to:

1. Apply EXIF rotation so images display correctly
2. Detect body landmarks (shoulders, hips)
3. Crop to the torso region with padding
4. Classify poses as front, side, side with arms forward, or side with arms back

~~~python
def load_image_with_exif(path):
    """Load image and apply EXIF rotation."""
    pil_img = Image.open(path)
    pil_img = ImageOps.exif_transpose(pil_img)
    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
~~~

The pose classification uses shoulder width in normalized coordinates. A narrow shoulder width (< 0.30) indicates a side view, while wider shoulders suggest front or back view.

This cleanup step was essential. OpenCV and MediaPipe don't automatically respect EXIF orientation metadata, so photos from phones that were stored rotated would fail pose detection entirely.

## Approach 1: Gemini API

The first approach was to send images directly to Google's Gemini models and ask for weight and body fat estimates. The prompt asks Gemini to analyze the image and return structured JSON:

~~~python
prompt = """
Analyze this image of a person.
Estimate their body weight (in lbs) and body fat percentage.

Provide the output strictly in this JSON format:
{
    "estimated_weight_lbs": <number>,
    "estimated_body_fat_percentage": <number>,
    "reasoning": "<brief explanation of visual cues used>"
}
"""
~~~

I implemented retry logic with exponential backoff for rate limits, and model fallback when daily quotas are exhausted (cycling through gemini-2.5-flash and gemini-2.5-flash-lite).

The results were interesting but not great. Gemini consistently overestimated weight by 10-15 lbs on average. It seemed to have a bias toward higher estimates, possibly from training data distributions.

## Approach 2: Local CNN

Since I had ground truth labels, I could train my own model. I used a ResNet18 pretrained on ImageNet, replacing the final layer with a regression head for weight prediction.

~~~python
model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
model.fc = nn.Linear(model.fc.in_features, 1)
~~~

Training used standard augmentations (random crops, flips, color jitter) and MSE loss. With only ~72 images this is a tiny dataset, but transfer learning helps significantly.

The local model achieved roughly 3.6 lbs mean absolute error on the validation set. For reference, a naive baseline of always guessing the mean weight would give roughly 5 lbs MAE on this dataset. So the model is learning something meaningful from the images, not just memorizing the average.

Having training data from the same person (me) with consistent photo conditions likely helps the model pick up on subtle visual cues.

## Learnings

A few things stood out from this project:

**Small personal datasets can work.** With only 72 images, I expected the CNN to overfit badly. But transfer learning from ImageNet combined with data augmentation produced usable results. The model learned person-specific features that generalize across the date range.

**LLMs struggle with precise physical estimates.** Gemini's estimates were directionally correct but systematically biased. This makes sense since the model wasn't trained specifically for this task and probably has limited exposure to weight estimation examples.

**Always compare to a naive baseline.** The 3.6 lb MAE sounded good, but only means something when compared to the ~5 lb MAE from just guessing the mean. The model is actually learning, not just exploiting the narrow weight range.

## Code

The project is on GitHub: [body-composition-estimator](https://github.com/Jambdy/body-composition-estimator)

It includes:
- `estimator.py` for Gemini API estimation
- `train_weight_predictor.py` for CNN training
- `smart_crop_and_classify.py` for MediaPipe preprocessing
- `weight_manager.py` for matching photos to weight records
