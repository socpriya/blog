---
layout: page
title: References
url: references
navigation_weight: 3
---

![screenshot]({{site.baseurl}}/assets/img/underscore.png)
Data Scientists often socialize with fellow Data Scientists. We collaborate, exchange ideas, and help each other to arrive at better solutions. This synergy helps us keep abreast of what is happening in Data Science World! 
{: .text-justify}

I had an opportunity to work with [Dr. Rajiv Shah](http://rajivshah.com/), adjunct Professor and Data Scientist, on one of his data science projects [Taking an H2O Model to Production](http://projects.rajivshah.com/blog/2016/08/22/H2O_prod/)
{: .text-justify}

![screenshot]({{ site.baseurl }}/assets/img/underscore.png)
In the [Chicago Food Inspection Forecasting]({{ site.baseurl }}/projects.html) project, the number of days before an inspection has to be made was forecasted as 6.55 days with _GLM_ and _Random Forest_ predictive models. I developed a model using _XGBoost algorithm_ and arrived at 7.79 days - an improvement of 1.24 days (19%). 
{: .text-justify}

Refer to the [pull request of this model](https://github.com/Chicago/food-inspections-evaluation/pull/98) made into [The City of Chicago’s GitHub](https://github.com/Chicago/food-inspections-evaluation) repository.
{: .text-justify}

![screenshot]({{ site.baseurl }}/assets/img/underscore.png)
[While working on structural steel drawings]({{ site.baseurl }}/assets/pdf/cadalyst/Weight Calculation-2.jpg) in AutoCAD, I often needed to calculate the total weight of materials—a task that was time-consuming and error-prone when done manually, especially during design revisions.
{: .text-justify}

To address this, I developed an AutoLISP routine called [WWT.LSP (window weight total)]({{ site.baseurl }}/assets/pdf/cadalyst/Weight Calculation-1.jpg). It allowed users to select numeric values either individually or through a window and automatically summed all real and integer numbers from the selected entities. 
{: .text-justify}

This simple utility significantly improved efficiency and accuracy, turning a repetitive manual process into a quick and reliable operation within the CAD workflow.
{: .text-justify}

![screenshot]({{ site.baseurl }}/assets/img/underscore.png)
[In dual-unit AutoCAD drawings]({{ site.baseurl }}/assets/pdf/cadalyst/MM to Inch Conversion-2.jpg), presenting dimensions in both metric and imperial units often required repetitive manual conversion and formatting, which could lead to inconsistencies.
{: .text-justify}

To address this, I created three short AutoLISP routines. [MMIN.LSP converts millimeter dimensions to inches]({{ site.baseurl }}/assets/pdf/cadalyst/MM to Inch Conversion-1.jpg) and appends the result in parentheses beside the original value, while INMM.LSP performs the reverse conversion. A third routine, TTRM.LSP, reformats dual dimensions by separating them onto two lines, placing one above the other for improved readability.
{: .text-justify}

The TTRM routine assumes standard dimension settings—DIMSCALE aligned with the drawing scale, DIMTXT set to 2.5, and a text style with zero height—ensuring consistent and clean presentation across drawings.
{: .text-justify}

![screenshot]({{ site.baseurl }}/assets/img/underscore.png)
