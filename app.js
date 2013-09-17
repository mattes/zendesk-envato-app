(function() {

  return {
    requests: {
      verify_purchase: function(purchase_code){
        return {
          url: 'http://marketplace.envato.com/api/edge/' + this.setting('username') + '/' + this.setting('api_key') + '/verify-purchase:' + purchase_code + '.json',
          dataType: 'json'
        };
      } 
    },
    events: {

      'keypress #purchase_code': function(event) {
        if(event.which == 13) {
          // enter pressed
          event.preventDefault();
          var purchase_code = this.$(event.target).val();
          if(purchase_code && purchase_code !== '') {
            this.ajax('verify_purchase', purchase_code);
            this.switchTo('loading', {
              purchase_code: purchase_code,
              username: this.setting('username')
            });
          } else {
            this.switchTo('failed', {
              message: this.I18n.t('purchase_code.type_purchase_code')
            });
          }

        }
      },

      'verify_purchase.done': function(data) {
        // example responses:
        // {"verify-purchase":{}}
        // {"verify-purchase":{"item_name":"NAME","item_id":"ID","created_at":"Tue Feb 26 18:51:02 +1100 2013","buyer":"USERNAME","licence":"Regular License"}}

        if(data) {
          if(data.hasOwnProperty('verify-purchase')) {
            if(data['verify-purchase'].hasOwnProperty('item_id')) {
              this.switchTo('verify_purchase_code_result', {
                item_name: data['verify-purchase']['item_name'],
                item_id: data['verify-purchase']['item_id'],
                created_at: data['verify-purchase']['created_at'],
                buyer: data['verify-purchase']['buyer'],
                licence: data['verify-purchase']['licence']
              });
            }
            else {
              this.switchTo('failed', {
                message: this.I18n.t('purchase_code.invalid_purchase_code')
              });
            }
          }
          else if(data.hasOwnProperty('error')) {
            this.switchTo('failed', {
              message: data.error
            });
          }
          else {
            this.switchTo('failed', {
              message: this.I18n.t('purchase_code.no_return_no_code')
            });
          }
        } else {
          this.switchTo('failed', {
            message: this.I18n.t('purchase_code.no_data')
          });
        }
      },

      'verify_purchase.fail': function() {
        this.switchTo('failed', {
          message: this.I18n.t('purchase_code.unable_to_contact')
        });
      }

    }
  };
}());