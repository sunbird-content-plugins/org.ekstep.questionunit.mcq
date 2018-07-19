var MCQController = MCQController || {};
MCQController.getHorizontalTemplate = function () {
  return "<div class='qc-option-container'> \
   <% if(question.config.layout == 'Horizontal' || (question.config.layout == undefined)){ %> \
     <% _.each(question.data.options, function(val,key,index) { %> \
      <div class='qc-option-value mcq-option-value' onclick=MCQController.pluginInstance.logTelemetryInteract(event);MCQController.pluginInstance.selectedvalue(event,<%= key %>)> \
      <div class='qc-option-text'> \
      <% if(MCQController.isImageIcon){%> \
      <div class='qc-opt'>\
      <%if(_.isEmpty(val.image)){%> \
         <img class='qc-option-image' src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultImageIcon)%>>\
        <%}else{%> \
           <img class='qc-option-image' onclick='MCQController.showImageModel(event)' src=<%=MCQController.pluginInstance.getAssetUrl( val.image)%>>\
          <%}%>\
      </div>\
      <% } %> \
        <% if(MCQController.isAudioIcon&&MCQController.isImageIcon){%> \
      <div class='qc-opt'>\
       <%if(_.isEmpty(val.audio)){%> \
         <img class='qc-horizontal-audio-disable' src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon) %>>\
        <%}else{%> \
           <img class='qc-horizontal-audio' onclick=MCQController.pluginInstance.playAudio('<%= val.audio %>')  src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon) %>>\
           <%}%>\
      </div>\
      <% }else if(MCQController.isAudioIcon&& !MCQController.isImageIcon){ %> \
         <div class='qc-opt'>\
       <%if(_.isEmpty(val.audio)){%> \
         <img class='qc-horizontal-audio-txt-disable' src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon) %>>\
        <%}else{%> \
           <img class='qc-horizontal-audio-txt' onclick=MCQController.pluginInstance.playAudio('<%= val.audio %>')  src=<%=MCQController.pluginInstance.getDefaultAsset(MCQController.pluginInstance._defaultAudioIcon) %>>\
           <%}%>\
      </div>\
        <%}%>\
        <% if(!MCQController.isImageIcon && !MCQController.isAudioIcon){%> \
      <div class='qc-opt'> \
      <span class='qc-option-txt-only'> \
      <%=val.text%> \
      </span> \
       </div>\
       <% }else if(!MCQController.isAudioIcon &&MCQController.isImageIcon){ %>  \
            <div class='qc-opt'> \
             <span class='qc-option-txt-image'> \
      <%=val.text%> \
      </span>\
       </div>\
        <% }else if(MCQController.isAudioIcon && !MCQController.isImageIcon){ %>  \
           <div class='qc-opt'> \
             <span class='qc-option-txt-audio'> \
      <%=val.text%> \
      </span>\
       </div>\
      <%}else{%> \
        <div class='qc-opt'> \
             <span class='qc-option-txt'> \
      <%=val.text%> \
      </span>\
       </div>\
        <%}%> \
         </div> \
        <div class='qc-option-checkbox'> \
          <input type='radio' name='radio' value='pass' class='qc-option-input-checkbox' id='option'> \
        </div> \
        </div> \
       <% }); %> \
    <% } %> \
</div>";
};