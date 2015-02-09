describe('Handlebars', function () {
    it('must be available in global scope', function () {
        expect(window.Handlebars).toBeDefined();
    });

    describe('Quick plugin', function () {

        beforeEach(function () {
            var outlet = document.createElement('div');
            outlet.setAttribute('id', 'outlet');
            document.body.appendChild(outlet);
            outlet = null;
        });

        afterEach(function () {
            jasmine.Ajax.uninstall();
            var outlet;
            if ((outlet = document.getElementById('outlet'))) {
                outlet.parentNode.removeChild(outlet);
                outlet = null;
            }
        });

        it('must be available', function () {
            expect(typeof window.Handlebars.quick).toBeDefined();
        });

        it('must be able to quick apply template', function () {
            window.Handlebars.quick.render('#outlet',
                '<div class="entry"><h1>{{title}}</h1><div class="body">{{body}}</div></div>', {
                    title: 'My New Post',
                    body: 'This is my first post!'
                });

            expect(document.getElementById('outlet').innerHTML)
                .toBe('<div class="entry"><h1>My New Post</h1><div class="body">This is my first post!</div></div>');
        });

        it('must be able to fetch template and spec asynchronously', function () {
            var doneFn = jasmine.createSpy("success");

            jasmine.Ajax.install(); // install fake ajax

            // create fake and expected ajax response for template
            jasmine.Ajax.stubRequest('post-entry.hbs').andReturn({
                responseText: '<div class="entry"><h1>{{title}}</h1><div class="body">{{body}}</div></div>'
            });

            // create fake and expected ajax response for spec
            jasmine.Ajax.stubRequest('post-entry.json').andReturn({
                responseText: '{"title": "Another Post", "body": "Another post!"}'
            });

            Handlebars.quick.renderAsync('#outlet', 'post-entry', 'post-entry', function () {
                expect(document.getElementById('outlet').innerHTML)
                    .toBe('<div class="entry"><h1>Another Post</h1><div class="body">Another post!</div></div>');
                doneFn();
            });

            expect(doneFn).toHaveBeenCalled();
        });

        it('must be able to asynchronously register a partial', function () {
            var doneFn = jasmine.createSpy("success");

            jasmine.Ajax.install(); // install fake ajax

            // create fake and expected ajax response for template
            jasmine.Ajax.stubRequest('post-entry.hbs').andReturn({
                responseText: '{{>post-partial}}'
            });

            // create fake and expected ajax response for spec
            jasmine.Ajax.stubRequest('post-entry.json').andReturn({
                responseText: '{"title": "Another Post", "body": "Another post!"}'
            });

            // create fake and expected ajax response for partial
            jasmine.Ajax.stubRequest('_post-partial.hbs').andReturn({
                responseText: '<div class="entry"><h1>{{title}}</h1><div class="body">{{body}}</div></div>'
            });

            // check partial initially not defined
            expect(Handlebars.partials['post-partial']).not.toBeDefined();

            // check if partial was loaded from file
            Handlebars.quick.registerPartialAsync('post-partial', function () {
                expect(Handlebars.partials['post-partial']).toBeDefined();
                doneFn();
            });

            // use the partial and verify output
            Handlebars.quick.renderAsync('#outlet', 'post-entry', 'post-entry', function () {
                expect(document.getElementById('outlet').innerHTML)
                    .toBe('<div class="entry"><h1>Another Post</h1><div class="body">Another post!</div></div>');
                doneFn();
            });

            expect(doneFn).toHaveBeenCalled();
        });

        it('must be able to asynchronously register multiple partials', function () {
            var doneFn = jasmine.createSpy("success");

            jasmine.Ajax.install(); // install fake ajax

            // create fake and expected ajax response for partial
            jasmine.Ajax.stubRequest('_post-title.hbs').andReturn({
                responseText: '<h1>{{this}}</h1>'
            });
            jasmine.Ajax.stubRequest('_post-body.hbs').andReturn({
                responseText: '<div class="body">{{this}}</div>'
            });

            // create fake and expected ajax response for template that uses the partials
            jasmine.Ajax.stubRequest('post-entry-wrapper.hbs').andReturn({
                responseText: '<div class="entry">{{#with title}}{{>post-title}}{{/with}}' +
                '{{#with body}}{{>post-body}}{{/with}}</div>'
            });

            // create fake and expected ajax response for spec
            jasmine.Ajax.stubRequest('post-entry.json').andReturn({
                responseText: '{"title": "Another Post", "body": "Another post!"}'
            });

            // check partial initially not defined
            expect(Handlebars.partials['post-title']).not.toBeDefined();
            expect(Handlebars.partials['post-body']).not.toBeDefined();

            // check if partials were loaded
            Handlebars.quick.registerPartialAsync(['post-title', 'post-body'], function () {
                expect(Handlebars.partials['post-title']).toBeDefined();
                expect(Handlebars.partials['post-body']).toBeDefined();
                doneFn();
            });

            // use the partial and verify output
            Handlebars.quick.renderAsync('#outlet', 'post-entry-wrapper', 'post-entry', function () {
                expect(document.getElementById('outlet').innerHTML)
                    .toBe('<div class="entry"><h1>Another Post</h1><div class="body">Another post!</div></div>');
                doneFn();
            });

            expect(doneFn).toHaveBeenCalled();
        });
    });
});
