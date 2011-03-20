# Rubato

*Tempo rubato* is a musical term referring to the expressive shaping of a piece by a slight speeding up and then 
slowing down of its tempo at the discretion of the musician.

Rubato is a tool to help you use your discretion to shape your time. It aims to free you from clock-watching 
as much as its can! It shows you the negative space between important
points in your schedule, leaving you free to build your intervening schedule in whatever way feels best.

## Use Rubato

Visit `src/rubato.html` or `index.html` if you've built it, and enter a **public Google Calendar ID**.

To find your **Google Calendar ID**, look at the `Calendar Address` under your calendars `Calendar settings`. 
You'll see something like `(Calendar ID: 1blfd3aakdn00t7tnm89h5vdkk@group.calendar.google.com)`. You can click
`Change sharing settings` to make sure the calendar is public: go there and make sure `Make this calendar public` 
is checked. That's it!

Once you have entered your calendar ID, that page is bookmarkable. You won't have to enter it every time.

## Easier still...

Visit [Rubato here](http://www.mikeandcordelia.com/rubato/) and enter an ID, or use 
`1blfd3aakdn00t7tnm89h5vdkk@group.calendar.google.com` to see a demo schedule and get a taste of what Rubato is like. 
[This link](http://www.mikeandcordelia.com/rubato/index.html?calendar=1blfd3aakdn00t7tnm89h5vdkk@group.calendar.google.com)
will even take you straight there. 

Here's [the same calendar](https://www.google.com/calendar/embed?src=1blfd3aakdn00t7tnm89h5vdkk%40group.calendar.google.com&ctz=America/New_York)
in Google Calendar for comparison.

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

