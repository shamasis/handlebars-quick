# Handlebars Quick

Simple extension for handlebars to get up and running with minimalistic API.

## Background

When starting off with handlebars, for real practical usage, one requires a number of assistive libraries. For instance, saving handlebars templates and specs within an `HTML` page being developed is not a feasible solution.

This simple extension makes life easier for developers starting to use handlebars or for developers who simply need the tempting abilities of handlebars right out of the box.

## What do you get?

This extension makes using handlebars a stroll in the park. Simply store your HTML template in a file, your specifications in a JSON file and ask Handlebars Quick to process them and apply the result to a DOM element.

## Usage Example

```html
<html>
<head>
    <script src="handlebars.js"></script>
    <script src="handlebars.quick.min.js"></script>
</head>

<body>
    <div id="content"></div>
    <script type="text/javascript">
    Handlebars.quick({
        template: '<div class="entry"><h1>{{title}}</h1><div class="body">{{body}}</div></div>',
        spec: {title: "My New Post", body: "This is my first post!"},
        target: '#content'
    });
    </script>
</body>
</html>
```

In case you want to store your handlebars template and specifications in separate files, you may use the `quickAsync`
function to fetch them using `AJAX`.

```html
<html>
<head>
    <script src="handlebars.js"></script>
    <script src="handlebars.quick.min.js"></script>
</head>

<body>
    <div id="content"></div>
    <script type="text/javascript">
    Handlebars.quickAsync({
        templateUrl: 'template-path/template.hbt',
        specUrl: 'spec-path/spec.json',
        target: '#content'
    }, function () {
        console.log('Handlebars.quickAsync has completed its job!');
    });
    </script>
</body>
</html>
```
