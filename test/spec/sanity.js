describe('Handlebars', function () {
    it('must be available in global scope', function () {
        expect(window.Handlebars).toBeDefined();
    });

    describe('Quick plugin', function () {
        afterEach(function () {
            jasmine.Ajax.uninstall();
            document.getElementById('outlet').innerHTML = '';
        });

        it('must be available', function () {
            expect(typeof window.Handlebars.quick).toBe('function');
            expect(typeof window.Handlebars.quickAsync).toBe('function');
        });

        it('must be able to quick apply template', function () {
            window.Handlebars.quick({
                template: '<div class="entry"><h1>{{title}}</h1><div class="body">{{body}}</div></div>',
                spec: {
                    title: 'My New Post',
                    body: 'This is my first post!'
                },
                target: '#outlet'
            });

            expect(document.getElementById('outlet').innerHTML)
                .toBe('<div class="entry"><h1>My New Post</h1><div class="body">This is my first post!</div></div>');
        });

        it('must be able to fetch template and spec asynchronously', function () {
            var doneFn = jasmine.createSpy("success");

            jasmine.Ajax.install(); // install fake ajax

            // create fake and expected ajax response for template
            jasmine.Ajax.stubRequest('post-entry.hbt').andReturn({
                responseText: '<div class="entry"><h1>{{title}}</h1><div class="body">{{body}}</div></div>'
            });

            // create fake and expected ajax response for spec
            jasmine.Ajax.stubRequest('post-entry.json').andReturn({
                responseText: '{"title": "Another Post", "body": "Another post!"}'
            });

            Handlebars.quickAsync({
                templateUrl: 'post-entry.hbt',
                specUrl: 'post-entry.json',
                target: '#outlet'
            }, function () {
                expect(document.getElementById('outlet').innerHTML)
                        .toBe('<div class="entry"><h1>Another Post</h1><div class="body">Another post!</div></div>');
                doneFn();
            });

            expect(doneFn).toHaveBeenCalled();
        });
    });
});
