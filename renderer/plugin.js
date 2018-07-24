/**
 *
 * Question Unit plugin to render a MCQ question
 * @class org.ekstep.questionunit.mcq
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.questionunitmcq = {};
org.ekstep.questionunitmcq.RendererPlugin = org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.mcq',
  _isContainer: true,
  _render: true,
  _selectedanswere: undefined,
  _constant: {
    gridLayout: "Grid",
    mcqParentDiv: "#qs-mcq-template",
    mcqSelectOption: ".mcq-option-value",
    optionSelectionUI: "qsselectedopt"
  },
  _defaultImageIcon: "default-image.png",
  _defaultAudioIcon: "audio.png",
  _selectedIndex: [],
  _lastAudio: undefined,
  _currentAudio: undefined,
  _totalCorrectAns:[],
  setQuestionTemplate: function() {
    this._question.template = MCQController.loadTemplateContent(); // eslint-disable-line no-undef
    MCQController.initTemplate(this); // eslint-disable-line no-undef
  },
  /**
   * Listen show event
   * @memberof org.ekstep.questionunit.mcq
   * @param {Object} event from question set.
   */
  preQuestionShow: function(event) {
    this._super(event);
    if (this._question.config.layout == this._constant.gridLayout) { // eslint-disable-line no-undef
      this.divideOption(this._question.data); // eslint-disable-line no-undef
    }
    if (this._question.config.isShuffleOption) {
      this._question.data.options = _.shuffle(this._question.data.options);
    }
  },
  /**
   * Listen event after display the question
   * @memberof org.ekstep.questionunit.mcq
   * @param {Object} event from question set.
   */
  postQuestionShow: function() {
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef
    MCQController.renderQuestion(); // eslint-disable-line no-undef
    this._selectedIndex = [];
    this.getCorrectAnswerCount(this._question.data.options,this);
    if (this._question.state && _.has(this._question.state, 'val')) {
      this._selectedIndex = this._question.state.val;
      _.each(this._selectedIndex, function(val) {
        $('#qs-mcq-template input:checkbox[name=checkbox]')[val].checked = true // eslint-disable-line no-undef
      })
    } else {
      this._selectedIndex = [];
    }
  },
  /**
   * on page load get all correct answer for user select ex: 
   * @memberof org.ekstep.questionunit.mcq
   * @param {Object} option from question set.
   */
  getCorrectAnswerCount:function(option,instance){
    _.each(option,function(val){
        if (val.isCorrect) instance._totalCorrectAns.push(val);
    })
  },
  /**
   * grid layout divide option
   * @memberof org.ekstep.questionunit.mcq
   * @param {Object} questionData from question set.
   */
  divideOption: function(questionData) {
    questionData.topOptions = [], questionData.bottomOptions = [];
    questionData.options.forEach(function(option, key) {
      var obj = {
        'option': option,
        'keyIndex': key
      };
      if (questionData.options.length <= 4 || questionData.options.length > 6) {
        if (key < 4) questionData.topOptions.push(obj);
        else questionData.bottomOptions.push(obj);
      } else if (questionData.options.length == 5 || questionData.options.length == 6) {
        if (key < 3) questionData.topOptions.push(obj);
        else questionData.bottomOptions.push(obj);
      }
    });
  },
  /**
   * Question evalution
   * @memberof org.ekstep.questionunit.mcq
   * @param {Object} event from question set.
   */
  evaluateQuestion: function(event) {
    var callback = event.target;
    var totalSelectedCorrectAns = 0,
     // totalCorrectAns = 0,
      correctAnswer = false,
      telemetryValues = [],
      selectedOption = [],
      result = {},
      option, instance;
    //get plugin instance;
    instance = MCQController.pluginInstance;// eslint-disable-line no-undef
    // if question state have value 1 and 2 and again user check and uncheck then duplicate value store in
    // selectedindex so remove all duplicate
    instance._selectedIndex = _.uniq(instance._selectedIndex);
    option = instance._question.data.options;
    _.each(option, function(val, index) {
      //get all correct option count
      // if (val.isCorrect) totalCorrectAns++;
      //chcck selected option index and option index
      if (instance._selectedIndex.indexOf(index) != -1) {
        //get all selected option in  selectedoption array
        selectedOption.push(option[index]);
      }
    });
    //  iterate selected option
    _.each(selectedOption, function(val) {
      //count all selected correct ans
      if (val.isCorrect) totalSelectedCorrectAns++;
      //push selected option value in telemetry value in option format
      telemetryValues.push({
        "option": val.image.length > 0 ? val.image : val.text
      })
    });
    //1.check total correct answer in question object and total selected correct answer
    //2.check selected correct answer length and total correct answer length
    // both and condition required in evalution
    if (instance._totalCorrectAns.length == totalSelectedCorrectAns && instance._selectedIndex.length == instance._totalCorrectAns.length) {
      correctAnswer = true;
    }
    var partialScore = this._question.config.partial_scoring ? (totalSelectedCorrectAns / option.length) * this._question.config.max_score : 0;
    result = {
      eval: correctAnswer,
      state: {
        val: instance._selectedIndex, // eslint-disable-line no-undef
        options: option // eslint-disable-line no-undef
      },
      score: partialScore, // eslint-disable-line no-undef
      values: selectedOption,
      noOfCorrectAns: totalSelectedCorrectAns,
      totalAns: instance._totalCorrectAns.length
    }
    if (_.isFunction(callback)) {
      callback(result);
    }
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESSEND, result); // eslint-disable-line no-undef
  },
  /**
   * provide media url to audio image
   * @memberof org.ekstep.questionunit.mcq
   * @returns {String} url.
   * @param {String} icon from question set.
   */
  getDefaultAsset: function(icon) {
    //In browser and device base path is different so we have to check
    if (isbrowserpreview) { // eslint-disable-line no-undef
      return this.getAssetUrl(org.ekstep.pluginframework.pluginManager.resolvePluginResource(this._manifest.id, this._manifest.ver, "renderer/assets/" + icon));
    } else {
      //static url
      return this.getAssetUrl("/content-plugins/" + this._manifest.id + "-" + this._manifest.ver + "/renderer/assets/" + icon);
    }
  },
  /**
   * provide media url to asset
   * @memberof org.ekstep.questionunit.mcq
   * @param {String} url from question set.
   * @returns {String} url.
   */
  getAssetUrl: function(url) {
    if (isbrowserpreview) { // eslint-disable-line no-undef
      return url;
    } else {
      return 'file:///' + EkstepRendererAPI.getBaseURL() + url;
    }
  },
  /**
   * play audio once at a time
   * @memberof org.ekstep.questionunit.mcq
   * @param {String} audio from question set.
   */
  playAudio: function(audio) {
    audio = this.getAssetUrl(audio);
    if (this._lastAudio && (this._lastAudio != audio)) { // eslint-disable-line no-undef
      this._currentAudio.pause(); // eslint-disable-line no-undef
    }
    if (!this._currentAudio || this._currentAudio.paused) { // eslint-disable-line no-undef
      this._currentAudio = new Audio(audio); // eslint-disable-line no-undef
      this._currentAudio.play(); // eslint-disable-line no-undef
      this._lastAudio = audio; // eslint-disable-line no-undef
    } else {
      this._currentAudio.pause(); // eslint-disable-line no-undef
      this._currentAudio.currentTime = 0 // eslint-disable-line no-undef
    }
  },
  /**
   * onclick option the function call
   * @memberof org.ekstep.questionunit.mcq
   * @param {event} event from question set.
   * @param {Integer} index from question set.
   */
  selectedvalue: function(event, index) {
    var state = {},
      value, telemetryValues = {},
      instance;
    instance = MCQController.pluginInstance;// eslint-disable-line no-undef
    if (!$('input:checkbox[name=checkbox]')[index].checked && ($("input:checkbox[name=checkbox]:checked").length<instance._totalCorrectAns.length)) {
       $('input:checkbox[name=checkbox]')[index].checked = true;
      //if check add value from select index
      instance._selectedIndex.push(index);
    } else {
      $('input:checkbox[name=checkbox]')[index].checked = false;
      //if uncheck remove value from select index
      instance._selectedIndex = _.without(instance._selectedIndex, index);
    }
    if (!_.isUndefined(event)) {
      // this.selectOptionUI(event);//eslint-disable-line no-undef
    }
    value = instance._question.data.options[index];
    state = {
      val: this._selectedIndex, // eslint-disable-line no-undef
      options: instance._question.data.options, // eslint-disable-line no-undef
      score: instance._question.config.max_score // eslint-disable-line no-undef
    };
    telemetryValues['option' + index] = value.image.length > 0 ? value.image : value.text;
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, { // eslint-disable-line no-undef
      "type": "MCQ",
      "values": [telemetryValues]
    });
    /**
     * renderer:questionunit.mcq:save question set state.
     * @event renderer:questionunit.mcq:dispatch
     * @memberof org.ekstep.questionunit.mcq
     */
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', state);
  },
  selectOptionUI: function(event) {
    if ($(event.target).hasClass(this._constant.mcqSelectOption.replace(".", ""))) {
      $(event.target).addClass(this._constant.optionSelectionUI);
    } else {
      $(event.target).parents(this._constant.mcqSelectOption).addClass(this._constant.optionSelectionUI);
    }
  },
  logTelemetryInteract: function(event) {
    if (event != undefined) QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.TOUCH, { // eslint-disable-line no-undef
      type: QSTelemetryLogger.EVENT_TYPES.TOUCH, // eslint-disable-line no-undef
      id: event.target.id
    });
  }
});
//# sourceURL=questionunitMCQPlugin.js