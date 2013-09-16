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
          purchase_code = this.$(event.target).val();
          if(purchase_code != '') {
            this.ajax('verify_purchase', purchase_code);
            this.switchTo('loading', {
              purchase_code: purchase_code,
              username: this.setting('username')
            });
          } else {
            this.switchTo('failed', {
              message: 'Please type purchase code.'
            });
          }

        }
      },

      'verify_purchase.done': function(data) {
        console.log(data);

        if(data) {
          if(data.hasOwnProperty('peng')) {
            this.switchTo('verify_purchase_code_result', {
              data: data
            });
          }
          else if(data.hasOwnProperty('error')) {
            this.switchTo('failed', {
              message: data.error
            });
          }
          else {
            this.switchTo('failed', {
              message: 'API did not retun verification, nor any error code.'
            });
          }
        } else {
          this.switchTo('failed', {
            message: 'API did not return any data.'
          });
        }
      },

      'verify_purchase.fail': function() {
        this.switchTo('failed', {
          message: 'Unable to contact API.'
        });
      }

    }
  };
}());