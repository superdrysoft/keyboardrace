We just opensourced our meteorjs project, keyboardrace.com.

As this was just a fun, "hack-day" project, we didn't really take the neccesary time to properly understand and optimise things.
Essentially, if you're interested in working on this project, you've got your work cut out for you.
Some problems we've identified so far:

1. As the DB size grows, CPU, Network and Disk IO usage all increase rapidly.
   We're certain that there are caching / publishing techniques among other things to fix this problem.

2. We did little bit of indexing on Mongo, but calculating aggregation data on front page is still very slow.
   The index file is located at /test/mongo_index


## Setup dev environment
1. Install Meteor: `curl https://install.meteor.com/ | sh`
2. Install Meteorite package manager: `npm install -g meteorite`
3. Install packages and start server: `mrt`