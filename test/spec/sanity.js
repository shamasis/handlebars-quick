describe('Handlebars', function () {
    it('must be available in global scope', function () {
        expect(window.Handlebars).toBeDefined();
    });

    describe('Quick plugin', function () {
        beforeEach(function () {
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
            // var doneFn = jasmine.createSpy("success");

            // Handlebars.quickAsync({
            //     templateUrl: 'post-entry.hbt',
            //     specUrl: 'post-entry.json',
            //     target: '#content'
            // }, doneFn);

            // expect(doneFn).toHaveBeenCalled();
        });
    });
});
