# Actions Scatter Plot CSV File Format

## Sections of the plot area

Plot is divided into sections called stages. Trainees are expected to perform certain actions during each stage. The plot should make it easier to see if the trainee is performing the actions at the right time.
CSV file has rows signaling the end of each stage and names of the stages appear in the second column of the csv rows. The stages are displayed as labeled vertical bands shaded in different colors on the plot.

## Data points plotted on Actions Scatter Plot

There are 3 types of data that can be plotted on Actions Scatter Plot:
1. **Actions**: (markedAsAction:true, isScatterPlotData: true, triggeredError: false) These are actions taken by trainees during the session. CPR was not considered as an action. CPR goes on for a period of time it covers a time interval. Plottable actions are snapshot actions which takes place at an instant.
    * **Correct**: If an action was performed and needed to be performed then it is considered as correct. There is no marker in the csv file that indicates an action is correct. Absence of a row pointing at the row to be error makes it correct.
    * **Erroneous**: If an action should not have been performed than it is considered as erroneous. They are marked by a row that shows up before or after the action row.
2. **CPR**: (markedAsAction:true, isScatterPlotData: false, triggeredError: false (need to ask about it)) Continuous action that foes on for a period of time. There are rows indicating the start and end of such. CPR periods are shown as horizontal lines on the plot.
3. **Stage Errors**: (markedAsAction:false, isScatterPlotData: false, triggeredError:true) If a trainee was supposed to take an action during a stage but did not take such action then those are reported at the end of csv file. Also need to ask if CPR error would be reported here no matter what or selectively like other actions depending on mistakenly done or missed to do it. These points have the timestamp of the stage transition boundary. They are displayed at the bottom of the plot spreading over the stage area.

## Parsing the CSV file

CSV file is parsed using a js library. The timestamp column of the csv file has H:MI:S format. That gets appended to the beginning of the day. That results in problems with running the integration test for parsing csv by reying on expected data stored statically in josn files. package.json test script depends on replaceDate.js code written by chat gpt to update those files with correct expected dates before running the test. Without running the script the tests can only pass for one day since the next day the current day of the date will change.
ActionsCsvRow and actionCsvRowProcessor are the backbone of the application. Row processor builds up the data structures that will be used by plotly js.

## To upgrade dependencies

```bash
npx npm-check-updates -u
npm i
```
## Docker Containerization

In compose file
volumes:
- .:/app:cached
makes the source code changes synced in container allowing reload to work when run with target:dev.

## Docker exe

You need to comment out dev/prod realted parts in Dockerfile if you are going to use docker exe to build and run the container.
With composer below, you can use target to selectively build the container for dev or prod.

```bash
docker build -t mteam-dashboard-nextjs .

docker run -p 3000:3000 mteam-dashboard-nextjs

docker ps
docker ls

docker stop mteam-dashboard-nextjs
#if you like to remove the image and the container
docker rm mteam-dashboard-nextjs
docker rmi mteam-dashboard-nextjs
```

### Docker compose

```bash
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build

docker-compose up

docker-compose down
```
