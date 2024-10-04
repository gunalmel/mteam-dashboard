# Actions Scatter Plot CSV File Format

## Sections of the plot area

Plot is divided into sections called stages. Trainees are expected to perform certain actions during each stage. The plot should make it easier to see if the trainee is performing the actions at the right time.
CSV file has rows signaling the end of each stage and names of the stages appear in the second column of the csv rows. The stages are displayed as labeled vertical bands shaded in different colors on the plot.

## Data points plotted on Actions Scatter Plot

There are 3 types of data that can be plotted on Actions Scatter Plot:
1. **Actions**: (isAction:true, isScatterPlotData: true, triggeredError: false) These are actions taken by trainees during the session. CPR was not considered as an action. CPR goes on for a period of time it covers a time interval. Plottable actions are snapshot actions which takes place at an instant.
    * **Correct**: If an action was performed and needed to be performed then it is considered as correct. There is no marker in the csv file that indicates an action is correct. Absence of a row pointing at the row to be error makes it correct.
    * **Erroneous**: If an action should not have been performed than it is considered as erroneous. They are marked by a row that shows up before or after the action row.
2. **CPR**: (isAction:true, isScatterPlotData: false, triggeredError: false (need to ask about it)) Continuous action that foes on for a period of time. There are rows indicating the start and end of such. CPR periods are shown as horizontal lines on the plot.
3. **Stage Errors**: (isAction:false, isScatterPlotData: false, triggeredError:true) If a trainee was supposed to take an action during a stage but did not take such action then those are reported at the end of csv file. Also need to ask if CPR error would be reported here no matter what or selectively like other actions depending on mistakenly done or missed to do it. These points have the timestamp of the stage transition boundary. They are displayed at the bottom of the plot spreading over the stage area.


