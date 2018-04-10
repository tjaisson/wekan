BlazeLayout.setRoot('body');

const i18nTagToT9n = (i18nTag) => {
  // t9n/i18n tags are same now, see: https://github.com/softwarerero/meteor-accounts-t9n/pull/129
  // but we keep this conversion function here, to be aware that that they are different system.
  return i18nTag;
};

Template.atSocial.helpers({
		buttonText_not() {
    var service = this;
    var serviceName = this._id;
    if (serviceName === "meteor-developer")
        serviceName = "meteor";
    if (serviceName === "entcoremln")
        serviceName = "MonLycée.net";
    if (serviceName === "entcorepcn")
        serviceName = "PCN";
    //serviceName = capitalize(serviceName);
    if (!service.configured)
        return T9n.get(AccountsTemplates.texts.socialConfigure, markIfMissing=false) + " " + serviceName;
    var showAddRemove = AccountsTemplates.options.showAddRemoveServices;
    var user = Meteor.user();
    if (user && showAddRemove){
        if (user.services && user.services[this._id]){
            var numServices = _.keys(user.services).length; // including "resume"
            if (numServices === 2)
                return serviceName;
            else
                return T9n.get(AccountsTemplates.texts.socialRemove, markIfMissing=false) + " " + serviceName;
        } else
                return T9n.get(AccountsTemplates.texts.socialAdd, markIfMissing=false) + " " + serviceName;
    }
    var parentData = Template.parentData();
    var state = (parentData && parentData.state) || AccountsTemplates.getState();
    var prefix = state === "signIn" ?
        T9n.get(AccountsTemplates.texts.socialSignIn, markIfMissing=false) :
        T9n.get(AccountsTemplates.texts.socialSignUp, markIfMissing=false);
    return prefix + " " + T9n.get(AccountsTemplates.texts.socialWith, markIfMissing=false) + " " + serviceName;
}
});

Template.userFormsLayout.onRendered(() => {
  const i18nTag = navigator.language;
  if (i18nTag) {
    T9n.setLanguage(i18nTagToT9n(i18nTag));
  }
  EscapeActions.executeAll();
});

Template.userFormsLayout.helpers({
  languages() {
    return _.map(TAPi18n.getLanguages(), (lang, code) => {
      const tag = code;
      let name = lang.name;
      if (lang.name === 'br') {
        name = 'Brezhoneg';
      } else if (lang.name === 'ig') {
        name = 'Igbo';
      }
      return { tag, name };
    }).sort(function(a, b) {
      if (a.name === b.name) {
        return 0;
      } else {
        return a.name > b.name ? 1 : -1;
      }
    });
  },

  isCurrentLanguage() {
    const t9nTag = i18nTagToT9n(this.tag);
    const curLang = T9n.getLanguage() || 'en';
    return t9nTag === curLang;
  },
});

Template.userFormsLayout.events({
  'change .js-userform-set-language'(evt) {
    const i18nTag = $(evt.currentTarget).val();
    T9n.setLanguage(i18nTagToT9n(i18nTag));
    evt.preventDefault();
  },
});

Template.defaultLayout.events({
  'click .js-close-modal': () => {
    Modal.close();
  },
});
