var MCQController = MCQController || {};

MCQController.layout = MCQController.layout || {
    preRender: function (question) { },
    getTemplate: function (question) { },
    onOptionSelected: function (event, index) {
        MCQController.pluginInstance.onOptionSelected(event, index);
    },
    postRender: function (question) { }
}

/* ** Grid ** */
MCQController.grid = MCQController.grid || jQuery.extend({}, MCQController.layout);

MCQController.grid.config = {
    optIndices: []
}

MCQController.grid.preRender = function (question) {
    MCQController.grid.config.optIndices = _.range(question.data.options.length);
}

MCQController.grid.getRowCount = function (optsCount) {
    return optsCount > 4 ? 2 : 1
}

MCQController.grid.onOptionSelected = function (event, index) {
    // clear all selected options and select this option
    $('.mcq-grid-option').removeClass('selected');
    var optElt = $(event.target).closest('.mcq-grid-option');
    if (optElt) optElt.addClass('selected');
    MCQController.pluginInstance.onOptionSelected(event, index);
    if (MCQController.pluginInstance._question.data.options[index].audio)
        MCQController.pluginInstance.playAudio({ src: MCQController.pluginInstance._question.data.options[index].audio });
}

MCQController.grid.getOptionTemplate = function (option, index) {
    var optTemplate = '\
  <div class="mcq-grid-option-outer">\
    <% if (false && option.audio){ %> \
      <div class="mcq-grid-option-audio">\
        <img src="<%= MCQController.pluginInstance.getDefaultAsset("audio-icon2.png") %>"  onclick=MCQController.pluginInstance.playAudio({src:\'<%= val.audio %>\'}) />\
      </div>\
    <% } %> \
    <div class="mcq-grid-option" onclick="MCQController.grid.onOptionSelected(event, <%= index %>)">\
    <% if (option.image){ %> \
      <div class="mcq-grid-option-image" style="background-image:url(<%= MCQController.pluginInstance.getAssetUrl(option.image) %>)">\
        <img src="<%= MCQController.pluginInstance.getAssetUrl(option.image) %>" style="display:none" />\
      </div>\
    <% } %> \
    <div class="selected-icon"><img src="<%= MCQController.pluginInstance.getDefaultAsset("tick_icon.png") %>"></div>\
    <% if (option.text){ %> \
      <div class="mcq-grid-option-text">\
        <div><%= option.text %></div>\
      </div>\
    <% } %> \
    </div>\
  </div>';
    return _.template(optTemplate)({ "option": option, "index": index });
}

MCQController.grid.getOptionsForRow = function (optIndices, i, options) {
    var rowOpts = [], opts = "";
    if (i == 0)
        rowOpts = optIndices.length > 4 ? _.take(optIndices, Math.round((optIndices.length * 1.0) / 2))
            : _.take(optIndices, optIndices.length);
    else {
        var remainingOptions = optIndices.length - Math.round((optIndices.length * 1.0) / 2);
        rowOpts = _.last(optIndices, remainingOptions);
    }
    _.each(rowOpts, function (o, i) {
        opts += MCQController.grid.getOptionTemplate(options[o], o);
    });
    return opts;
}

MCQController.grid.getOptionRows = function (optIndices, options) {
    var rowTemplate = '';
    var r = 0; maxRow = MCQController.grid.getRowCount(optIndices.length);
    while (r < maxRow) {
        rowTemplate += '<div class="mcq-grid-options-row">\
			<div class="mcq-grid-option-wrapper">'+
            MCQController.grid.getOptionsForRow(optIndices, r, options)
            + '</div></div>';
        r++;
    }
    return rowTemplate;
}

MCQController.grid.getOptionsTemplate = function (options) {
    return MCQController.grid.getOptionRows(MCQController.grid.config.optIndices, options);
}

MCQController.grid.getTemplate = function (question) {
    var template =
        org.ekstep.questionunit.backgroundComponent.getBackgroundGraphics() +
        '<div class="mcq-question-container-grid plugin-content-container">\
    <div class="mcq-grid-question-container question-content-container">' +
        org.ekstep.questionunit.questionComponent.generateQuestionComponent() +
        '</div>\
    <div class="mcq-grid-option-container"><div>' +
        MCQController.grid.getOptionsTemplate(question.data.options) +
        '</div></div>\
    </div>';
    return template;
}

/** Horizontal */
MCQController.horizontal = MCQController.horizontal || jQuery.extend({}, MCQController.layout);

MCQController.horizontal.getTemplateForLayout = function (layout) {
    var wrapperStartQuestionComponent = '<div class="question-content-container">';
    var wrapperEndQuestionComponent = '</div>';
    var wrapperEnd = '</div>';
    var layoutTemplate = MCQController.horizontal.getOptionLayout(layout);
    return org.ekstep.questionunit.backgroundComponent.getBackgroundGraphics() + '<div class="mcq-content-container plugin-content-container" id="mcq-question-container">' +
        wrapperStartQuestionComponent +
        org.ekstep.questionunit.questionComponent.generateQuestionComponent(MCQController.pluginInstance._manifest.id) +
        wrapperEndQuestionComponent +
        layoutTemplate +
        wrapperEnd;
}

/**
 * returns complete sequence plugin renderer html, 
 * @param {String} selectedLayout selected layout from editor
 * @param {Object} availableLayout provides list of layouts
 * @memberof org.ekstep.questionunit.mcq.horizontal_and_vertical
 */
MCQController.horizontal.getTemplate = function (question) {
    return MCQController.horizontal.getTemplateForLayout(question.config.layout.toLowerCase());
}

MCQController.horizontal.getOptionLayout = function (layout) {
    var audioIcon;
    if ('vertical' == layout) {
        audioIcon = "music-blue.png"
    } else {
        audioIcon = "audio-icon2.png"
    }
    return '<div class="option-container ' + layout + '">\
            <div class="option-block-container">\
            <% _.each(question.data.options,function(val,key){ %>\
                <div class="option-block <% if(val.isCorrect) { %> mcq-correct-answer<% } %>" onclick="MCQController.horizontal.onSelectOption(this, <%= key %>);MCQController.horizontal.onOptionSelected(event,<%= key %>)">\
                    <div class="option-image-container <% if(!val.image) { %> no-image<% } %>" \>\
                  <%  if(val.image) { %>\
                        <img onclick="MCQController.showImageModel(event, \'<%= val.image %>\')" src="<%= val.image %>" />\
                  <% } %>\
                    </div>\
                    <%  if(val.audio) { %>\
                      <img src="<%= MCQController.pluginInstance.getDefaultAsset("'+ audioIcon + '") %>" class="audio" />\
                    <% } %>\
                    <div class="option-text-container<% if(val.audio) { %> with-audio <% } %> <% if(val.image) { %>with-image<% } %>">\
                  <%  if(val.text) { %>\
                        <span><%= val.text %></span>\
                  <% } %>\
                    </div>\
                    <img src="<%= MCQController.pluginInstance.getDefaultAsset("tick_icon.png") %>" class="tick" />\
                </div>\
              <% }) %>\
              </div>\
            </div>\
          </div>'
}

MCQController.horizontal.onSelectOption = function (element, index) {
    $('.option-block').removeClass('selected');
    $(element).addClass('selected');
    if (MCQController.pluginInstance._question.data.options[index].audio) {
        MCQController.pluginInstance.playAudio({ src: MCQController.pluginInstance._question.data.options[index].audio });
    }
}
/** Vertical */
MCQController.vertical = MCQController.vertical || jQuery.extend({}, MCQController.layout, MCQController.horizontal);

/** Vertical2 */
MCQController.vertical2 = MCQController.vertical2 || jQuery.extend({}, MCQController.layout);

MCQController.vertical2.getTemplate = function (question) {
    var questionTemplate = MCQController.vertical2.getQuestionTemplate();
    var optionsTemplate = MCQController.vertical2.getOptionsTemplate(question.data.options);
    return org.ekstep.questionunit.backgroundComponent.getBackgroundGraphics() + "<div class='mcq-qLeft-content-container'>"
        + questionTemplate + optionsTemplate +
        "</div>";
}

MCQController.vertical2.getQuestionTemplate = function () {
    return "<div class='mcq-qLeft-question-container'>\
                <div class='mcq-question-image'>\
                <% if(question.data.question.image){%>\
                <img class='q-image' onclick='MCQController.showImageModel(event)'\ src=<%=MCQController.pluginInstance.getAssetUrl( question.data.question.image) %> />\
                <%}%>\
                </div>\
                <div class='mcq-question-text'>\
                  <div class='mcq-text-content'>\
                  <span style='display:table-cell; vertical-align:middle;'><%= question.data.question.text %></span>\
                  </div>\
                </div>\
                <% if ( question.data.question.audio.length > 0 ){ %> \
                <img class='audio-image' src=<%= MCQController.pluginInstance.getDefaultAsset('audio-icon2.png')%> onclick=MCQController.pluginInstance.playAudio({src:'<%= question.data.question.audio %>'}) />\
                <% } %> \
              </div>\
              ";
}

MCQController.vertical2.getOptionsTemplate = function (options) {
    var opts = ''
    _.each(options, function (val, key, index) {
        opts += MCQController.vertical2.getOption(val, key);
    });
    return "<div class='mcq-2-options-container'>"
        + opts +
        "</div>\
";
}

MCQController.vertical2.getOption = function (option, key) {
    var optTemplate = "<div class='text-option option-background text-option-<%=key+1%>' onClick=MCQController.vertical2.onOptionSelected(event,<%= key %>)>\
    <div class='audio-option-image-container'>\
    <% if ( option.audio.length > 0 ){ %> \
    <img class='audio-option-image'    src=<%= MCQController.pluginInstance.getDefaultAsset('audio-icon2.png')%> onclick=MCQController.pluginInstance.playAudio({src:'<%= option.audio %>'}) />\
    <% } %> \
    </div>\
    <div class='text-content'>\
    <div class='text-content-outer'>\
    <div class='text-content-inner'>\
    <%= option.text %>\
    </div>\
    </div>\
    </div>\
    <div class='tick-icon-holder'>\
    <img src=<%= MCQController.pluginInstance.getDefaultAsset('tick_icon.png') %> style='height: 100%;'>\
    </div>\
    </div>"
    return _.template(optTemplate)({ "option": option, "key": key });
}

MCQController.vertical2.adjustOptions = function (question) {
    var optLength = question.data.options.length;
    if (optLength == 2) {
        $(".text-option-1").css("margin-top", "25.71%");
    }
    else if (optLength == 3) {
        $(".text-option-1").css("margin-top", "12.85%");
    }
}

MCQController.vertical2.postRender = function (question) {
    if (question.data.options.length < 4) {
        MCQController.vertical2.adjustOptions(question);
    }
}

MCQController.vertical2.onOptionSelected = function (event, index) {
    $('.text-option').removeClass('opt-selected');
    var optElt = $(event.target).closest('.text-option');
    if (optElt) optElt.addClass('opt-selected');
    MCQController.pluginInstance.onOptionSelected(event, index);
}

/** Grid2 */
MCQController.grid2 = MCQController.grid2 || jQuery.extend({}, MCQController.layout);

MCQController.grid2.getTemplate = function (question) {
    var questionTemplate = MCQController.vertical2.getQuestionTemplate();
    var optionsTemplate = MCQController.grid2.getOptionsTemplate(question.data.options)
    return org.ekstep.questionunit.backgroundComponent.getBackgroundGraphics() + "<div class='mcq-qLeft-content-container'>"
        + questionTemplate + optionsTemplate +
        "</div>";
}

MCQController.grid2.adjustOptions = function (question) {
    var optLength = question.data.options.length;
    if (optLength == 2) {
        $(".mcq2-2-option").css("margin-top", "15%");
    }
    else if (optLength == 3) {
        $(".mcq2-2-option3").css("margin-left", "17.15%");
    }
}

MCQController.grid2.postRender = function (question) {
    if (question.data.options.length < 4) {
        MCQController.grid2.adjustOptions(question);
    }
}

MCQController.grid2.getOptionsTemplate = function (options) {
    var optionTemplate = ''
    _.each(options, function (val, key, index) {
        optionTemplate += MCQController.grid2.getOption(val, key);
    });
    return optionTemplate;
}

MCQController.grid2.getOption = function (option, key) {
    var optTemplate = " <div class='mcq2-2-option mcq2-2-option<%=key+1%>' onClick=MCQController.grid2.onOptionSelected(event,<%= key %>)>\
  <%if(option.image){%>\
      <img class='mcq2-2-option-image'\
      src=<%=MCQController.pluginInstance.getAssetUrl(option.image) %> />\
  <%}%>\
  <%if(!option.image && option.text){%>\
    <div class='mcq2-2-option-text'><%= option.text %></div>\
  <%}%>\
  <div class='mcq2-2-check-image-holder' >\
    <img class='mcq2-2-check-image'\
    src=<%= MCQController.pluginInstance.getDefaultAsset('tick_icon.png') %> />\
  </div>\
</div>\
";
    return _.template(optTemplate)({ "option": option, "key": key });
}

MCQController.grid2.onOptionSelected = function (event, index) {
    $('.mcq2-2-option').removeClass('opt-selected');
    var optElt = $(event.target).closest('.mcq2-2-option');
    if (optElt) optElt.addClass('opt-selected');
    MCQController.pluginInstance.onOptionSelected(event, index);
    if (MCQController.pluginInstance._question.data.options[index].audio)
        MCQController.pluginInstance.playAudio({ src: MCQController.pluginInstance._question.data.options[index].audio });
}
