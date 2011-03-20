# Rubato

Rubato aims to free you from clock-watching as much as it can! It shows you the negative space between important
points in your schedule, leaving you free to build your intervening schedule in whatever way feels best.

## Use Rubato

Visit `src/rubato.html` or `index.html` if you've built it, and enter a **public Google Calendar ID**.

To find your **Google Calendar ID**, look at the `Calendar Address` under your calendars `Calendar settings`. 
You'll see something like `(Calendar ID: bmojkrmcasv362rvqili27u2k8@group.calendar.google.com)`. You can click
`Change sharing settings` to make sure the calendar is public: go there and make sure `Make this calendar public` 
is checked. That's it!

Once you have entered your calendar ID, that page is bookmarkable. You won't have to enter it every time.

## Develop Rubato

Rubato is written in javascript using [jQuery](http://jquery.com/) and the 
[Google Calendar API](http://code.google.com/apis/calendar/overview/). Rubato's tests 
use [specit](https://github.com/joshuaclayton/specit).

### Run the tests

Go to `test/all.test.html` and look for green!

### Rakefile

`rake -T` will show you your options. 

* `rake index` will copy `src/rubato.html` as `index.html` and adjust some paths. 
* `rake tar` will tar up the most useful files for deployment to a server.

