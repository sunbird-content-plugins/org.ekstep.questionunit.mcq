/*
 * Plugin to create MCQ question
 * @class org.ekstep.questionunitmcq:mcqQuestionFormController
 * Jagadish P<jagadish.pujari@tarento.com>
 */
angular.module('mcqApp', ['org.ekstep.question'])
  .controller('mcqQuestionFormController', ['$scope', '$rootScope', 'questionServices','$sce', function ($scope, rootScope, questionServices,$sce) {
    $scope.formVaild = false;
    $scope.mcqConfiguartion = {
      'questionConfig': {
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      },
      'optionsConfig': [{
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      }, {
        'isText': true,
        'isImage': true,
        'isAudio': true,
        'isHint': false
      }]
    };
    $scope.mcqFormData = {
      'question': {
        'text': '',
        'image': '',
        'audio': '',
        'audioName': '',
        'hint': ''
      },
      'options': [{
        'text': '',
        'image': '',
        'audio': '',
        'audioName': '',
        'hint': '',
        'isCorrect': false
      }, {
        'text': '',
        'image': '',
        'audio': '',
        'audioName': '',
        'hint': '',
        'isCorrect': false
      }],
      'questionCount': 0
    };
    $scope.oHint = [];
    $scope.questionMedia = {};
    $scope.optionsMedia = {
      'image': [],
      'audio': []
    };
    $scope.mcqFormData.media = [];
    $scope.editMedia = [];
    $scope.ckConfig={// eslint-disable-line no-undef
      customConfig: ecEditor.resolvePluginResource('org.ekstep.questionunit', '1.0', "editor/ckeditor-config.js"),
      skin: 'moono-lisa,' + CKEDITOR.basePath + "skins/moono-lisa/",// eslint-disable-line no-undef
      contentsCss: CKEDITOR.basePath + "contents.css"// eslint-disable-line no-undef
    };
    var questionInput = CKEDITOR.replace('ckedit',$scope.ckConfig);
    questionInput.on('change', function() {
      $scope.mcqFormData.question.text = this.getData();
    });
    questionInput.on('focus', function () {
      $scope.generateTelemetry({ type: 'TOUCH', id: 'input', pageid: 'question-creation-mcq-form', target: { id: 'questionunit-mcq-question', ver: '', type: 'input' } })
    });
    angular.element('.innerScroll').on('scroll', function () {
      $scope.generateTelemetry({ type: 'SCROLL', id: 'form', target: { id: 'questionunit-mcq-form', ver: '', type: 'form' } })
    });
    $scope.init = function () {
      $scope.mcqPluginInstance = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.questionunit.mcq")
      EventBus.listeners['org.ekstep.questionunit.mcq:validateform'] = [];
      ecEditor.addEventListener('org.ekstep.questionunit.mcq:validateform', function (event, callback) {
        var validationRes = $scope.formValidation();
        callback(validationRes.isValid, validationRes.formData);
      }, $scope);
      EventBus.listeners['org.ekstep.questionunit.mcq:editquestion'] = [];
      ecEditor.addEventListener('org.ekstep.questionunit.mcq:editquestion', $scope.editMcqQuestion, $scope);
      ecEditor.dispatchEvent("org.ekstep.questionunit:ready");
    }
    $scope.editMcqQuestion = function (event, data) {
      var qdata = data.data;
      $scope.mcqFormData.question = qdata.question;
      $scope.mcqFormData.options = qdata.options;
      $scope.editMedia = qdata.media;
      var opLength = qdata.length;
      if (opLength > 2) {
        for (var j = 2; j < opLength; j++) {
          $scope.mcqFormData.options.push({
            'text': '',
            'image': '',
            'audio': '',
            'audioName': '',
            'isCorrect': false
          });
          $scope.$safeApply();
        }
      }
      if ($scope.mcqFormData.options.length < 2) {
        $scope.mcqFormData.options.splice(2, 1);
      }
      $scope.$safeApply();
    }
    $scope.addAnswerField = function () {
      var option = {
        'text': '',
        'image': '',
        'audio': '',
        'audioName': '',
        'isCorrect': false
      };
      if ($scope.mcqFormData.options.length < 8) $scope.mcqFormData.options.push(option);
    }
    $scope.getTextFromHTML = function(html) {
      var div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText;
    };
    $scope.isFormValid=function(index){
      var opData={
              "text":$scope.getTextFromHTML($scope.mcqFormData.options[index].text),
              "image":$scope.getTextFromHTML($scope.mcqFormData.options[index].image),
              "audio":$scope.getTextFromHTML($scope.mcqFormData.options[index].audio)
            }
      if(opData.text.length != 0 || opData.image.length != 0 || opData.audio.length != 0) {
              ecEditor.jQuery('#option-box-' + index).removeClass('has-errorCard');
              $scope.mcqForm.$valid = true;
            }else{
              ecEditor.jQuery('#option-box-' + index).addClass('has-errorCard');
              $scope.mcqForm.$valid = false;
              return false;
            }
    }
    $scope.formValidation = function () {
      var opSel = false;
      var valid = false;
      var opData;
      var optionElems = ecEditor.jQuery('.option-text');
      optionElems.each(function (i, op) {
          var index = op.id.split('options_')[1];
          ecEditor.jQuery('option-box').removeClass('has-errorCard');
           if(index && CKEDITOR.instances[op.id]) {
            $scope.mcqFormData.options[index].text = CKEDITOR.instances[op.id].getData();
            $scope.isFormValid(index);
          } else{
            $scope.isFormValid(index);
          }
      });
      var formValid = $scope.mcqForm.$valid && $scope.mcqFormData.options.length > 1;
      $scope.submitted = true;
      if (!($scope.mcqFormData.question.text.length || $scope.mcqFormData.question.image.length || $scope.mcqFormData.question.audio.length)) {
        $('.questionTextBox').addClass("ck-error");
      } else {
        $('.questionTextBox').removeClass("ck-error");
      }
      if (!_.isUndefined($scope.selectedOption)) {
        _.each($scope.mcqFormData.options, function (k, v) {
          $scope.mcqFormData.options[v].isCorrect = false;
        });
        valid = true;
        $scope.mcqFormData.options[$scope.selectedOption].isCorrect = true;
      } else {
        _.each($scope.mcqFormData.options, function (k, v) { // eslint-disable-line no-unused-vars
          if (k.isCorrect) {
            valid = true;
          }
        });
      }
      if (valid) {
        opSel = true;
        $scope.selLbl = 'success';
      } else {
        opSel = false;
        $scope.selLbl = 'error';
      }
      var tempArray = [];
      var temp = [];
      _.isEmpty($scope.questionMedia.image) ? 0 : tempArray.push($scope.questionMedia.image);
      _.isEmpty($scope.questionMedia.audio) ? 0 : tempArray.push($scope.questionMedia.audio);
      _.each($scope.optionsMedia.image, function (key, val) { // eslint-disable-line no-unused-vars
        tempArray.push(key);
      });
      _.each($scope.optionsMedia.audio, function (key, val) { // eslint-disable-line no-unused-vars
        tempArray.push(key);
      });
      temp = tempArray.filter(function (element) {
        return element !== undefined;
      });
      $scope.editMedia = _.isEmpty(temp) ? 0 : _.union($scope.editMedia, temp);
      $scope.mcqFormData.media = _.isEmpty($scope.editMedia[0]) ? temp : $scope.editMedia;
      //check if audio is their then add audio icon in media array
      if ($scope.mcqFormData.media.length > 0) $scope.addDefaultMedia();
      var formConfig = {};
      formConfig.formData = $scope.mcqFormData;
      if (formValid && opSel) {
        formConfig.isValid = true;
      } else {
        formConfig.isValid = false;
      }
      return formConfig;
    }

    $scope.deleteAnswer = function (id) {
      if (id >= 0) $scope.mcqFormData.options.splice(id, 1);
    }

    //if audio added then audio icon id sent to ecml add stage
    $scope.addDefaultMedia = function () {
      var addAllMedia = [{
        id: "org.ekstep.questionset.audioicon",
        src: ecEditor.resolvePluginResource("org.ekstep.questionunit.mcq", "1.0", 'renderer/assets/audio.png'),
        assetId: "org.ekstep.questionset.audioicon",
        type: "image",
        preload: true
      }, {
        id: "org.ekstep.questionset.default-imgageicon",
        src: ecEditor.resolvePluginResource("org.ekstep.questionunit.mcq", "1.0", 'renderer/assets/default-image.png'),
        assetId: "org.ekstep.questionset.default-imgageicon",
        type: "image",
        preload: true
      }];
      addAllMedia.forEach(function (obj) {
        $scope.mcqFormData.media.push(obj);
      })
    }
    /**
     * invokes the asset browser to pick an image to add to either the question or the options
     * @param {string} type if `q` then it is image for question, else for options
     * @param {string} index if `id` is not `q` but an index, then it can be either 'LHS' or 'RHS'
     * @param {string} mediaType `image` or `audio`
     */
    $scope.addMedia = function (type, index, mediaType) {
      var mediaObject = {
        type: mediaType,
        search_filter: {} // All composite keys except mediaType
      }
      //Defining the callback function of mediaObject before invoking asset browser
      mediaObject.callback = function (data) {
        var telemetryObject = { type: 'TOUCH', id: 'button', target: { id: '', ver: '', type: 'button' } };
        var media = {
          "id": Math.floor(Math.random() * 1000000000), // Unique identifier
          "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
          "assetId": data.assetMedia.id, // Asset identifier
          "type": data.assetMedia.type, // Type of asset (image, audio, etc)
          "preload": false // true or false
        };

        if (type == 'q') {
          telemetryObject.target.id = 'questionunit-mcq-add' + mediaType;
          $scope.mcqFormData.question[mediaType] = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          data.assetMedia.type == 'audio' ? $scope.mcqFormData.question.audioName = data.assetMedia.name : '';
          $scope.questionMedia[mediaType] = media;
        } else {
          telemetryObject.target.id = 'questionunit-mcq-option-add-' + mediaType;
          $scope.mcqFormData.options[index][mediaType] = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
          data.assetMedia.type == 'audio' ? $scope.mcqFormData.options[index].audioName = data.assetMedia.name : '';
          $scope.optionsMedia[mediaType][index] = media;
        }
        $scope.generateTelemetry(telemetryObject)
        if(!$scope.$$phase) {
          $scope.$digest()
        }
      }
      questionServices.invokeAssetBrowser(mediaObject);
    }

    /**
     * Deletes the selected media from the question element (question, LHS or RHS options)
     * @param {string} type 
     * @param {Integer} index 
     * @param {string} mediaType 
     */
    $scope.deleteMedia = function (type, index, mediaType) {
      var telemetryObject = { type: 'TOUCH', id: 'button', target: { id: '', ver: '', type: 'button' } };
      if (type == 'q') {
        $scope.mcqFormData.question[mediaType] = '';
        delete $scope.questionMedia[mediaType];
      } else {
        $scope.mcqFormData.options[index][mediaType] = '';
        delete $scope.optionsMedia[mediaType][index];
      }
      $scope.generateTelemetry(telemetryObject)
    }

    $scope.addHint = function (id) {
      if (id == 'q') {
        $scope.qHint = true;
      } else {
        $scope.oHint[id] = true;
      }
    }

    $scope.deleteHint = function (id) {
      if (id == 'q') {
        $scope.qHint = false;
        $scope.mcqFormData.question.hint = '';
      } else {
        $scope.oHint[id] = false;
        $scope.mcqFormData.options[id].hint = '';
      }
    }

    /**
     * Helper function to generate telemetry event
     * @param {Object} data telemetry data
     */
    $scope.generateTelemetry = function (data) {
      data.plugin = data.plugin || {
        "id": $scope.mcqPluginInstance.id,
        "ver": $scope.mcqPluginInstance.ver
      }
      data.form = data.form || 'question-creation-mcq-form';
      questionServices.generateTelemetry(data);
    }
    $scope.optionEditable = function(event) {
      var optionElement = ecEditor.jQuery(event.target);
      if(!optionElement.hasClass('option-text')) {
        optionElement = optionElement.parents('.option-text');
      }
      if(!optionElement.hasClass('cke_editable_inline')) {
        optionElement.attr('contenteditable', true);
        optionElement.attr('title', '');
        var editor = CKEDITOR.inline(optionElement[0].id, $scope.ckConfig);
        editor.on('blur', function (e) {
          ecEditor.jQuery('.cke_float').hide();
        });
        $( ".innerScroll" ).scroll(function() {
          ecEditor.jQuery('.cke_float').hide();
        });
        optionElement.focus();
      }
      $scope.generateTelemetry({type: 'TOUCH', id: 'input', target: {id: 'questionunit-mcq-answer', ver: '', type: 'input'}})
    };
    $scope.init();
     $scope.optionBindHtml=function(html_code){
      return $sce.trustAsHtml(html_code);
    }
     $scope.callbacks = {
      deleteMedia: $scope.deleteMedia,
      addMedia: $scope.addMedia,
      qtype: 'mcq'
    }
  }]);
//# sourceURL=horizontalMCQ.js
