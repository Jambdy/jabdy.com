+++
title = "Number Recognition with CNN"
description = "Classification and Detection with Convolutional Neural Networks"
tags = [
    "Computer Vision",
    "Machine Learning",
    "Python",
    "MSc",
]
date = 2017-12-04
author = "James Abdy"
+++
﻿<p>This was the final project of the Computer Vision course for my Master&rsquo;s degree.</p>

<h2 id="demo">Demo</h2>

<iframe width="560" height="315" src="https://www.youtube.com/embed/78Wz84wI_R8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

<h2 id="existing-methods">Existing Methods</h2>

<p>Convolutional Neural Networks (CNNs) are used widely in the field of computer vision today to perform recognition. They are a form of deep learning that rely on many hidden layers to classify an input. The weights for the layers are learned by iteratively training over large datasets. One of the first papers to address this method is �ImageNet Classification with Deep Convolutional Neural Networks� by Krizhevsky et al. from 2012 [1]. The research showed that CNNs can perform well on very challenging classification problems like the eclectic ImageNet data set. The results proved better then than any other supervised learning techniques used used in the 2010 competition.</p>

<p>Another influential paper that expanded this area was �Very Deep Convolutional Networks For Large-Scale Image Recognition� by Simonyan and Zisserman from 2014 [2].  It introduced the CNN architecture called VGG16 among others that showed the positive effect of very deep learning (16 layers in the case of VGG16). These CNNs with high-depth weight layers further improved performance on the ImageNet dataset. A large portion of this project revolves around adapting the CNNs from this paper for the classification problem of identifying digits an image in the Street View House Numbers (SVHN) dataset.</p>

<h2 id="implementation">Implementation</h2>

<h3 id="preprocessing">Preprocessing</h3>

<p>In order to begin training my CNN models, I first had to preprocess the SVHN data. I used the data in format 2 with the cropped images. I used the approach in the Simonyan paper which included subtracting the mean RGB value from each image. This had the effect of centering the pixel values around zero. I also divided the pixel intensities by 255 which resulted in values between [-0.5,0.5]. When using the VGG16 models, I had to resize the images from 32x32 to the minimum requirement of 48x48.</p>

<p>Another preprocessing step of sorts I took was to add additional samples to the SVHN data that included examples of non-digit images.  The images were taken from UCF�s CRCV data set which includes many google street images. I went through a random selection of images and extracted 32 by 32 samples. In total I added 30,000 new samples (30 samples from 1,000 different images. I put 80% in the training set and 20% in the testing set. I labeled this samples as 10 to indicate they are not digits.</p>

<h3 id="handling-location-and-scale-invariance">Handling Location and Scale Invariance</h3>

<p>In order to account for digits potentially appearing at any location, I employed a sliding window technique. This involved taking a fixed window size and moving it across the entire length of the image. The classifier was run at the current window location and the results were stored. The process was then repeated at the next location. This can be a rather expensive operation, so one way I mitigated the performance costs was to specify a stride size greater than 1 (5). This means that the window will jump the stride amount horizontally and vertically instead of exhaustively covering every pixel. This reduces the number of classification by approximately stride^2 (25 times in my case). The risk of this approach is some smaller digits could be skipped, but it did not appear to be a large issue in my results.</p>

<p>To meet the need for scale invariance I used an image pyramid in conjunction with the sliding window. Starting with the original image size, I would run the sliding window classifier over it until completion. I then blurred the image and halved the image size (blurring is necessary to prevent image distortion/aliasing). Using the same sized window, I applied the sliding window classification process again. By keeping the window size fixed, this enabled me to classify larger digits. This process continued until the image size was less than the window size. This process also caused the prediction time to increase. To control this I resized every input image to a height of 400 pixels before doing  predictions. This reduced the number of layers in the image pyramid and the area the sliding window needed to cover.</p>

<p>One problem the sliding window/image pyramid approach introduced was over lapping digit bounding boxes. The way I solved this issue was by implementing Non-Maximum Suppression. It consolidates the  bounding boxes by eliminating all but one box that exceeds a overlap threshold in a region. It could probably be improved because sometimes it selects the wrong sized box.</p>

<h3 id="model-variation">Model Variation</h3>

<p>I experimented with three main types of CNN models. One was my own architecture, another was training VGG16 from scratch, and the last was using the pre-trained weights for VGG16.</p>

<p>To build my own CNN architecture, I looked at the VGG16 implementation and Keras tutorials for inspiration. I used a very simple structure with only two convolutional layers using 3x3 filters and a 2x2 max-pooling layer. My goals with this model was to just get familiar with the CNN structure. A dense layer with a softmax function is used at the end. It returns the probability that a sample is of the possible classes (0-9 for the digits and 10 for non-digit).</p>

<p>The next approach I took was to train a VGG16 implementation from scratch. I used the model available in the Keras Applications. The weights parameter was specified as None, leaving me with the existing architecture initialized to random values. The model was trained with my version of the SVHN dataset. In order to use this CNN for the digit classification problem, I had to feed the output of the final layer of VGG16 into a dense softmax layer with 11 classes similar to what was mentioned above.</p>

<p>Finally I experimented with the pre-trained weights for VGG16. These weights were calculated by training the VGG16 model on the ImageNet dataset. That dataset is composed of hundreds of thousands of examples with 1,000 classes. The classes cover a range of things including objects and animals. These are seemingly unrelated to digits, but generalizing a model  trained for one problem to another (or transfer learning) has been shown to be very effective [3]. In order to do the transfer learning, I tried two approaches. The first approach I used was to initialize the layer values in VGG16 with the weights from ImageNet, but to retrain all of them with the new dataset. The other approach I used was to freeze the first 6 layers of VGG16, meaning that those weights would not be changed during training. I choose the first 6 layers because the Analytics Vidhya article mentions that earlier layers capture more general features like overall shape.</p>

<h3 id="model-parameters">Model Parameters</h3>

<p>For all approaches  mentioned above, I had a set of parameters to choose for the model compilation and model fitting process. One parameter that is used when the modeled is compiled for training is the loss function. The loss function measures the average difference between the prediction made by the model and the actual label for each input [3]. I utilized categorical cross-entropy in all models.  It is appropriate where each instance belongs to exactly one of multiple classes. Another related compile parameter is the optimizer.  It attempts to minimize the value of the loss function during training. I experimented with  Stochastic gradient descent (SGD) and Adam.</p>

<p>The optimizers also have parameters that can be specified. A key parameter is the learning rate. It determines how much weights change each iteration. A higher learning rate means that the weights will change faster, as the belief in the new state is higher. By default SGD has a static learning rate; however I set it to change over time with the ReduceLROnPlateau callback function in Keras. If the loss function fails to improve in an epoch, then the learning rate is reduced by a factor of 10 (similar to the the  Simonyan paper). Adam uses adaptive learning rates that are different for each parameter [5]. When testing with Adam, I had the most success with the learning rate lowered to 0.001. However I did not see any benefit using Adam over SGD when testing my own architecture, so I ended up setting the optimizer to SGD for all of the models.</p>

<p>An important parameter for the training process is batch size. Batch size specifies the number of samples used during one gradient update in training. A lower batch size can reduce training times/memory requirements, but can also decrease accuracy. I found a batch size of 100 lead to relatively fast training with no noticeable impact to accuracy.</p>

<p>In order to determine when to stop training, I utilized Keras&rsquo;s built in early stop callback functionality. It was set to monitor validation loss and stop training if it failed to improve for three epochs. The purposed of this is to prevent overfitting, or where the model is too specific to the training data and does not generalize well. An added bonus was speeding up training time by eliminating unnecessary epochs. For the purposes of generating the training graphs, I disabled early stopping.</p>

<h2 id="learning-results">Learning Results</h2>

<p>The learning curves for the 4 different models are shown below.</p>

<p><img class="plot_lc" src="/img/cnn/lc_all.png">
<img class="plot_lc" src="/img/cnn/lc_MyCNN.png">
<img class="plot_lc" src="/img/cnn/lc_VGG16Pre.png">
<img class="plot_lc" src="/img/cnn/lc_VGG16Scratch.png">
<img class="plot_lc" src="/img/cnn/lc_VGG16Frozen.png"></p>

<p>From the learning curves it can be seen that training accuracy increase sharply as the number of epochs increases in the beginning for all models. It then plateaus at 5 to 11 epochs based on the model. The VGG16 trained from scratch takes the longest to reach a steady state, which makes sense since it has no prior information to help it train. My CNN also lacks prior information, but it is simplistic enough to quickly train all the layers. There does not appear to be much overfitting in any of the models as validation accuracy does not decline as training accuracy increases. Interestingly the two pre-trained VGG16 models have relatively high validation accuracy in the early epochs, showing the value of the transfer learning.</p>

<p>The final results for each algorithm with early stopping are shown in the table below:</p>

<table border=1>
    <thead>
        <tr>
            <th>Model</th>
            <th>    Train Acc</th>
            <th>    Val Acc</th>
            <th>    Test Acc</th>
            <th>    Training Time (s)</th>
            <th>    Parameters to Train</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>VGG16 - Pre-trained</td>
            <td>    0.982</td>
            <td>    0.982</td>
            <td>    0.971</td>
            <td>    970</td>
            <td>    14720331</td>
        </tr>
        <tr>
            <td>VGG16 - Pre-trained - Frozen</td>
            <td>    0.98</td>
            <td>    0.978</td>
            <td>    0.967</td>
            <td>    720</td>
            <td>    14460171</td>
        </tr>
        <tr>
            <td>VGG16 - From Scratch</td>
            <td>    0.994</td>
            <td>    0.951</td>
            <td>    0.942</td>
            <td>    2134</td>
            <td>    14720331</td>
        </tr>
        <tr>
            <td>My CNN</td>
            <td>    0.915</td>
            <td>    0.93</td>
            <td>    0.864</td>
            <td>    161</td>
            <td>    157387</td>
        </tr>
    </tbody>
</table>

<p>I found the pre-trained VGG16 model without the frozen layer to be the most successful model for the digits classification problem. The pre-trained model with the frozen layers was very close, but had slightly lower testing accuracy. However it may have been a better choice since it took less time to train. The prediction run time is the same since it had the same underlying architecture. The VGG16 trained from scratch took a very long time to train as one might expect. My CNN trained quickly, but was significantly less accurate than the other three models.</p>

<h2 id="improvements">Improvements</h2>

<p>There are numerous areas where I could have improved my project. On the classification side it would have been helpful to use a better GPU initially. When I first started the project, I was using the GPU on my personal laptop which only had 2GB of memory. This made training the CNN models a very time consuming process. I eventually rented a VM from AWS with a much better GPU (NVIDIA K80), which sped up training by approximately 5 to 10 times. This illustrated that will CNNs are very powerful tools, they are also very computationally expensive to use. Switching earlier would have given me more time to experiment with the various parameters for all the models. As it is, I was only able to test the learning rates and batch sizes with a low number of epochs. I would have also liked to employee cross validation to get more stable/accurate learning curves. Right now they are dependent on the one validation set generated at random.</p>

<p>Another gap in my classifier is that it is not especially invariant to rotation. As the video shows, the CNN model can handle only slight changes in rotations. Given more time I would have liked to explore Keras�s Image Data Generator functionality. I know that it is possible to specify a rotation range that it will use to generate additional training instances. The same is true for light invariance. The zca_whitening option could help there. One reason the classifier can handle some light and noise variations is that the SVHN dataset is fairly large already and includes digits with different shades/clarity.</p>

<p>On the pipeline side, I believe there is a lot of opportunity to improve how I handle false negatives. Initially my classifier produced ten plus false negatives in every image. To address this I set a very high probability threshold of 0.999, but this had the effect of also omitting valid digits. Introducing an 11th class of non-digits helped reduce false negatives also. I believe it would be beneficial if I expanded the size the non-digits dataset.</p>

<p>Even though I faced many challenges in this project, it was still effective in demonstrating the power of deep learning in image recognition.</p>

<h2 id="citation">Citation</h2>

<p>[1] A. Krizhevsky, I. Sutskever, and G. E. Hinton, �ImageNet classification with deep convolutional neural networks,� Communications of the ACM, vol. 60, no. 6, pp. 84�90, 2017.
<a href="https://www.nvidia.cn/content/tesla/pdf/machine-learning/imagenet-classification-with-deep-convolutional-nn.pdf">https://www.nvidia.cn/content/tesla/pdf/machine-learning/imagenet-classification-with-deep-convolutional-nn.pdf</a></p>

<p>[2] K. Simonyan and A. Zisserman, �Very Deep Convolutional Networks for Large-Scale Image Recognition,� ArXiv e-prints, Sep. 2014.
<a href="https://arxiv.org/pdf/1409.1556.pdf">https://arxiv.org/pdf/1409.1556.pdf</a></p>

<p>[3] D. Gupta, �Transfer learning &amp; The art of using Pre-trained Models in Deep Learning,� Analytics Vidhya, 01-Jun-2017. [Online]. Available: <a href="https://www.analyticsvidhya.com/blog/2017/06/transfer-learning-the-art-of-fine-tuning-a-pre-trained-model/">https://www.analyticsvidhya.com/blog/2017/06/transfer-learning-the-art-of-fine-tuning-a-pre-trained-model/</a>.</p>

<p>[4] A. Karpathy, CS231n Convolutional Neural Networks for Visual Recognition. [Online]. Available: <a href="http://cs231n.github.io/neural-networks-2/#losses">http://cs231n.github.io/neural-networks-2/#losses</a>.</p>

<p>[5] S. Lau, �Learning Rate Schedules and Adaptive Learning Rate Methods for Deep Learning,� Towards Data Science, 29-Jul-2017. [Online]. Available: <a href="https://towardsdatascience.com/learning-rate-schedules-and-adaptive-learning-rate-methods-for-deep-learning-2c8f433990d1">https://towardsdatascience.com/learning-rate-schedules-and-adaptive-learning-rate-methods-for-deep-learning-2c8f433990d1</a></p>