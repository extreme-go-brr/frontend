import { defineBoot } from '#q-app/wrappers';
import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';
export default defineBoot(function (_a) {
    var app = _a.app;
    var i18n = createI18n({
        locale: 'en-US',
        legacy: false,
        messages: messages,
    });
    // Set i18n instance on app
    app.use(i18n);
});
