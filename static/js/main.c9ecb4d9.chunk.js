(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{118:function(e,t,a){},120:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),l=a(45),o=a.n(l),s=(a(65),a(2)),r=a(3),c=a(5),d=a(4),m=a(6),u=(a(15),a(24)),h=a.n(u),g=(a(112),a(116),{apiKey:"AIzaSyBJuUseKfGN_MjNEWg722WY1FsO2xZ1AuE",authDomain:"grovv-22cbd.firebaseapp.com",databaseURL:"https://grovv-22cbd.firebaseio.com",projectId:"grovv-22cbd",storageBucket:"grovv-22cbd.appspot.com",messagingSenderId:"30272449560"}),f=function e(){Object(s.a)(this,e),h.a.apps.length||h.a.initializeApp(g),this.db=h.a.database(),this.auth=h.a.auth()},v=a(58),p=a.n(v),w=a(59),C=a.n(w),y=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).handleUsernameChange=function(e){a.setState({username:e.target.value})},a.handlePasswordChange=function(e){a.setState({password:e.target.value})},a.handleSubmit=function(){console.log("SignIn submit pressed");var e=a.state.username,t=a.state.password;console.log("SignUp submit pressed - username ".concat(e)),a.validateEmail(e)?(a.setState({username:"",password:""}),a.hideSigninFields(),a.firebase.auth.signInWithEmailAndPassword(e,t).catch(function(e){var t=e.code,a=e.message;console.log("".concat(t,": ").concat(a)),alert("".concat(t,": ").concat(a)),this.setState({SHOWFIELDS:!0})}),console.log("username ".concat(e," - logged in")),a.props.signIn("songwall")):alert("Bad email me thinks :(")},a.hideSigninFields=function(){a.setState({SHOWFIELDS:!1})},a.showSigninFields=function(){a.setState({SHOWFIELDS:!0})},a.state={username:"",password:"",SHOWFIELDS:!1},a.firebase=new f,a.firebase.auth.onAuthStateChanged(function(e){e||a.showSigninFields()}),a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"validateEmail",value:function(e){return/^\S+@\S+$/.test(String(e).toLowerCase())}},{key:"validatePassword",value:function(e){return/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(String(e))}},{key:"render",value:function(){return this.state.SHOWFIELDS?i.a.createElement("div",{id:"signin-div"},i.a.createElement("h3",null,"Sign In"),i.a.createElement("div",null,"Email:",i.a.createElement("input",{id:"signin-username",value:this.state.username,onChange:this.handleUsernameChange})),i.a.createElement("div",null,"Password:",i.a.createElement("input",{type:"password",id:"signin-password",value:this.state.password,onChange:this.handlePasswordChange})),i.a.createElement("div",null,i.a.createElement("button",{id:"submit-signin-btn",onClick:this.handleSubmit}," Sign in! "))):i.a.createElement("div",null,"One Moment...")}}]),t}(n.Component),E=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).hideSignupFields=function(){a.setState({SHOWFIELDS:!1})},a.showSignupFields=function(){a.setState({SHOWFIELDS:!0})},a.handleUsernameChange=function(e){a.setState({username:e.target.value})},a.handlePasswordChange=function(e){a.setState({password:e.target.value})},a.handleSubmit=function(){var e=a.state.username,t=a.state.password;return console.log("SignUp submit pressed - username ".concat(e)),a.validateEmail(e)?a.validatePassword(t)?void a.firebase.auth.createUserWithEmailAndPassword(e,t).catch(function(e){var t=e.code,a=e.message;console.log("".concat(t,": ").concat(a))}):(alert("Bad password. Must be 7-15 characters with at least 1 numeric digit and a special character."),void a.setState({password:""})):(alert("Bad email me thinks :("),void a.setState({username:""}))},a.handleGotoSignIn=function(){a.props.gotoSignIn("signin"),console.log("Goto signin pressed")},a.state={username:"",password:"",SHOWFIELDS:!1},a.firebase=new f,a.firebase.auth.onAuthStateChanged(function(e){e?a.postUserToFirebase(e.uid,e.email):a.showSignupFields()}),a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"postUserToFirebase",value:function(e,t){var a=(new Date).getTime(),n={uid:e,username:t,createdAt:a,updatedAt:a},i={};return i["/users/"+e]=n,this.firebase.db.ref().update(i)}},{key:"validateEmail",value:function(e){return/^\S+@\S+$/.test(String(e).toLowerCase())}},{key:"validatePassword",value:function(e){return/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(String(e))}},{key:"render",value:function(){return this.state.SHOWFIELDS?i.a.createElement("div",{id:"signup-div"},i.a.createElement("h3",null,"Sign Up"),i.a.createElement("div",null,"Email:",i.a.createElement("input",{id:"signup-username",value:this.state.username,onChange:this.handleUsernameChange})),i.a.createElement("div",null,"Password:",i.a.createElement("input",{type:"password",id:"signup-password",value:this.state.password,onChange:this.handlePasswordChange})),i.a.createElement("div",null,i.a.createElement("button",{id:"submit-signup-btn",onClick:this.handleSubmit}," Sign up! ")),i.a.createElement("div",null,i.a.createElement("button",{id:"goto-signin-btn",onClick:this.handleGotoSignIn}," Sign in! "))):i.a.createElement("div",null,"One Moment...")}}]),t}(n.Component),b=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).handleUsernameChange=function(e){a.setState({username:e.target.value})},a.handleSubmit=function(){},a.handleChangePassword=function(){alert("Sorry - request from reset admin for now.")},a.state={username:""},a.firebase=new f,a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return i.a.createElement("div",{id:"Profile-Page"},i.a.createElement("div",{id:"Profile-Page-Header"},i.a.createElement("div",null,"Email: ",i.a.createElement("b",null,this.props.username)),i.a.createElement("button",{onClick:this.handleChangePassword},"Change Password")))}}]),t}(n.Component),S=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).state={},a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return i.a.createElement("div",{id:"Chart-Page"},i.a.createElement("iframe",{id:"Food-Chart",title:"FoodChart",src:"https://docs.google.com/spreadsheets/d/e/2PACX-1vQiIvBEmBjgIFQ_5vSAZJrzVTepyDpyDYeNrOrfqWOuraA_MHZE_sRLyGkcARlIYR-INkuwq667Seqe/pubhtml?widget=true&headers=false"}))}}]),t}(n.Component),A=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).saveConfig=function(){console.log("Saving config... (TODO)"),a.firebase.db.ref().child("grow").child("-LdG6gTCNZxfu1wU5Xvx").child("config").set({temp_min:a.state.temp_min,temp_max:a.state.temp_max,temp_hist:a.state.temp_hist,fan_min:a.state.fan_min,fan_max:a.state.fan_max,humidity_min:a.state.humidity_min,humidity_max:a.state.humidity_max,humidity_hist:a.state.humidity_hist,humidifier_min:a.state.humidifier_min,humidifier_max:a.state.humidifier_max})},a.watchConfig=function(){a.firebase.db.ref().child("grow").child("-LdG6gTCNZxfu1wU5Xvx").child("config").on("value",function(e){console.log(e.val()),a.setState({temp_min:e.val().temp_min,temp_max:e.val().temp_max,temp_hist:e.val().temp_hist,fan_min:e.val().fan_min,fan_max:e.val().fan_max,humidity_min:e.val().humidity_min,humidity_max:e.val().humidity_max,humidity_hist:e.val().humidity_hist,humidifier_min:e.val().humidifier_min,humidifier_max:e.val().humidifier_max})},function(e){console.log("follow config failed: "+e.code)})},a.handleTempMinChange=function(e){a.setState({temp_min:e.target.value})},a.handleTempMaxChange=function(e){a.setState({temp_max:e.target.value})},a.handleTempHistChange=function(e){a.setState({temp_hist:e.target.value})},a.handleFanMinChange=function(e){a.setState({fan_min:e.target.value})},a.handleFanMaxChange=function(e){a.setState({fan_max:e.target.value})},a.handleHumidityMinChange=function(e){a.setState({humidity_min:e.target.value})},a.handleHumidityMaxChange=function(e){a.setState({humidity_max:e.target.value})},a.handleHumidityHistChange=function(e){a.setState({humidity_hist:e.target.value})},a.handleHumidifierMinChange=function(e){a.setState({humidifier_min:e.target.value})},a.handleHumidifierMaxChange=function(e){a.setState({humidifier_max:e.target.value})},a.state={temp_min:null,temp_max:null,temp_hist:null,fan_min:null,fan_max:null,humidity_min:null,humidity_max:null,humidity_hist:null,humidifier_min:null,humidifier_max:null},a.firebase=new f,a.watchConfig(),a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return i.a.createElement("div",{id:"Config-Page"},i.a.createElement("div",{id:"Config-Temp-Field"},i.a.createElement("h2",null,"TEMPERATURE"),i.a.createElement("div",{id:"Config-Temp-Min-Max"},i.a.createElement("div",null,"Min:",i.a.createElement("input",{type:"number",className:"Config-Input",id:"temp-min",value:this.state.temp_min,onChange:this.handleTempMinChange}),"\xb0C"),i.a.createElement("div",null,"Max:",i.a.createElement("input",{type:"number",className:"Config-Input",id:"temp-max",value:this.state.temp_max,onChange:this.handleTempMaxChange}),"\xb0C"),i.a.createElement("div",null,"Hist:",i.a.createElement("input",{type:"number",className:"Config-Input",id:"temp-hist",value:this.state.temp_hist,onChange:this.handleTempHistChange}),"\u0394\xb0C")),i.a.createElement("h3",null,"FAN POWER"),i.a.createElement("div",{id:"Config-Fan-Min-Max"},i.a.createElement("div",null,"Min:",i.a.createElement("input",{type:"number",className:"Config-Input",id:"fan-min",value:this.state.fan_min,onChange:this.handleFanMinChange}),"%"),i.a.createElement("div",null,"Max:",i.a.createElement("input",{type:"number",className:"Config-Input",id:"fan-max",value:this.state.fan_max,onChange:this.handleFanMaxChange}),"%"))),i.a.createElement("div",{id:"Config-Humidity-Field"},i.a.createElement("h2",null,"HUMIDITY"),i.a.createElement("div",{id:"Config-Humidity-Min-Max"},i.a.createElement("div",null,"Min:",i.a.createElement("input",{type:"number",className:"Config-Input",id:"humidity-min",value:this.state.humidity_min,onChange:this.handleHumidityMinChange}),"% R.H."),i.a.createElement("div",null,"Max:",i.a.createElement("input",{type:"number",className:"Config-Input",id:"humidity-max",value:this.state.humidity_max,onChange:this.handleHumidityMaxChange}),"% R.H."),i.a.createElement("div",null,"Hist:",i.a.createElement("input",{type:"number",className:"Config-Input",id:"humidity-hyst",value:this.state.humidity_hist,onChange:this.handleHumidityHistChange}),"\u0394 % R.H.")),i.a.createElement("h3",null,"HUMIDIFIER POWER"),i.a.createElement("div",{id:"Config-Humidifier-Min-Max"},i.a.createElement("div",null,"Min:",i.a.createElement("input",{type:"number",className:"Config-Input",id:"humidifier-min",value:this.state.humidifier_min,onChange:this.handleHumidifierMinChange}),"%"),i.a.createElement("div",null,"Max:",i.a.createElement("input",{type:"number",className:"Config-Input",id:"humidifier-max",value:this.state.humidifier_max,onChange:this.handleHumidifierMaxChange}),"%"))),i.a.createElement("div",{id:"SAVE-CONFIG-BTN",onClick:this.saveConfig},"SAVE"))}}]),t}(n.Component),H=(a(118),a(25)),x=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).state={width:40,height:40,x:150,y:200,URLS:a.props.urls},a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return i.a.createElement("div",{id:"Resizeable-Console-Page"},i.a.createElement("div",{className:"Resizeable-Row"},i.a.createElement("div",{className:"Resizeable-Plotly"},i.a.createElement(H.a,{className:"RND-Plotly",default:{x:0,y:0,width:"100%",height:"100%"}},i.a.createElement("div",{className:"moveHandle"},"\u2904"),i.a.createElement("object",{className:"Rnd-View",style:{zIndex:this.state.zPlotly},type:"text/html",data:this.props.urls.plotly,width:"100%",height:"100%","aria-label":"plotly"}))),i.a.createElement("div",{className:"Resizeable-Cam"},i.a.createElement(H.a,{className:"RND-Cam",default:{x:0,y:0,width:"100%",height:"100%"}},i.a.createElement("div",{className:"moveHandle"},"\u2904"),i.a.createElement("object",{className:"Rnd-View",style:{zIndex:this.state.zLivecam},type:"text/html",data:this.props.urls.livecam,width:"100%",height:"100%","aria-label":"live cam"})))),i.a.createElement("div",{className:"Resizeable-Row"},i.a.createElement("div",{className:"Resizeable-Plotly"},i.a.createElement(H.a,{className:"RND-Plotly",default:{x:0,y:0,width:"100%",height:"100%"}},i.a.createElement("div",{className:"moveHandle"},"\u2904"),i.a.createElement("object",{className:"Rnd-View",style:{zIndex:this.state.zVeggerPlotly},type:"text/html",data:this.props.urls.vegger_plotly,width:"100%",height:"100%","aria-label":"vegger plotly"}))),i.a.createElement("div",{className:"Resizeable-Cam"},i.a.createElement(H.a,{className:"RND-Cam",default:{x:0,y:0,width:"100%",height:"100%"}},i.a.createElement("div",{className:"moveHandle"},"\u2904"),i.a.createElement("object",{className:"Rnd-View-Vegger",style:{zIndex:this.state.zVeggerLivecam},type:"text/html",data:this.props.urls.vegger_livecam,width:"100%",height:"100%","aria-label":"vegger live cam"})))))}}]),t}(n.Component),I="#91eebb",N="#FFA500",L="#FF0000",B=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(c.a)(this,Object(d.a)(t).call(this,e))).watchSensors=function(){var e=a.firebase.db.ref().child("sensor_data");e.child("flower").limitToLast(1).on("child_added",function(e){console.log("new flower year data key: "+e.key),a.watchFlowerYear(e.key)},function(e){console.log("sensorwatch flower failed: "+e.code)}),e.child("vegger").limitToLast(1).on("child_added",function(e){console.log("new vegger year data key: "+e.key),a.watchVeggerYear(e.key)},function(e){console.log("sensorwatch vegger failed: "+e.code)})},a.watchFlowerYear=function(e){a.firebase.db.ref().child("sensor_data").child("flower").child(e).limitToLast(1).on("child_added",function(t){console.log("new flower month data key: "+t.key),a.watchFlowerMonth(t.key,e)},function(e){console.log("sensorwatch flower failed: "+e.code)})},a.watchFlowerMonth=function(e,t){a.firebase.db.ref().child("sensor_data").child("flower").child(t).child(e).limitToLast(1).on("child_added",function(n){console.log("new flower day data key: "+n.key),a.watchFlowerDay(n.key,e,t)},function(e){console.log("sensorwatch flower failed: "+e.code)})},a.watchFlowerDay=function(e,t,n){a.firebase.db.ref().child("sensor_data").child("flower").child(n).child(t).child(e).limitToLast(1).on("child_added",function(i){console.log("new flower hour data key: "+i.key),a.watchFlowerHour(i.key,e,t,n)},function(e){console.log("sensorwatch flower failed: "+e.code)})},a.watchFlowerHour=function(e,t,n,i){a.firebase.db.ref().child("sensor_data").child("flower").child(i).child(n).child(t).child(e).on("child_added",function(e){var t=Math.round(10*e.val().cTemp)/10,n=Math.round(10*e.val().humidity)/10;console.log("Flower cTemp: ".concat(t," // Flower Humidity ").concat(n," ")),a.flowerTempRef.current.style.background=t>20&&t<27?I:t<19||t>28?L:N,a.flowerHumidityRef.current.style.background=n>30&&n<43?I:n<27||n>45?L:N,a.setState({sFlowerTemp:t,sFlowerHumidity:n})},function(e){console.log("follow flower hour failed: "+e.code)})},a.watchVeggerYear=function(e){a.firebase.db.ref().child("sensor_data").child("vegger").child(e).limitToLast(1).on("child_added",function(t){console.log("new vegger month data key: "+t.key),a.watchVeggerMonth(t.key,e)},function(e){console.log("sensorwatch flower failed: "+e.code)})},a.watchVeggerMonth=function(e,t){a.firebase.db.ref().child("sensor_data").child("vegger").child(t).child(e).limitToLast(1).on("child_added",function(n){console.log("new vegger day data key: "+n.key),a.watchVeggerDay(n.key,e,t)},function(e){console.log("sensorwatch flower failed: "+e.code)})},a.watchVeggerDay=function(e,t,n){a.firebase.db.ref().child("sensor_data").child("vegger").child(n).child(t).child(e).limitToLast(1).on("child_added",function(i){console.log("new vegger hour data key: "+i.key),a.watchVeggerHour(i.key,e,t,n)},function(e){console.log("sensorwatch vegger failed: "+e.code)})},a.watchVeggerHour=function(e,t,n,i){a.firebase.db.ref().child("sensor_data").child("vegger").child(i).child(n).child(t).child(e).on("child_added",function(e){var t=Math.round(10*e.val().cTemp)/10,n=Math.round(10*e.val().humidity)/10;console.log("Vegger cTemp: ".concat(t," // Vegger Humidity ").concat(n," ")),a.veggerTempRef.current.style.background=t>22&&t<29?I:t<20||t>30?L:N,a.veggerHumidityRef.current.style.background=n>40&&n<80?I:n<35||n>85?L:N,a.setState({sVeggerTemp:t,sVeggerHumidity:n})},function(e){console.log("follow vegger failed: "+e.code)})},a.getUsername=function(){a.firebase.db.ref().child("users").child(a.state.UID).on("value",function(e){a.setState({username:e.val().username})},function(e){console.log("The username read failed: "+e.code)})},a.getUrls=function(){a.firebase.db.ref().child("users").child(a.state.UID).child("urls").on("value",function(e){a.setState({URL_livecam:e.val().livecam,URL_plotly:e.val().plotly,URL_vegger_livecam:e.val().vegger_livecam,URL_vegger_plotly:e.val().vegger_plotly,urls:e.val(),mainContent:"resizeview"})},function(e){console.log("The url read failed: "+e.code)})},a.handleSignOut=function(){a.setState({UID:null,URL_livecam:null,URL_plotly:null}),a.firebase.auth.signOut().then(function(){console.log("signed out")}).catch(function(e){console.log("Error signing out: ".concat(e))})},a.handleSignIn=function(){},a.handleMenuHandle=function(){console.log("Yup...pressed."),"-240px"!==a.leftMenuRef.current.style.left?a.leftMenuRef.current.style.left="-240px":a.leftMenuRef.current.style.left="0"},a.setMainContent=function(e){a.setState({mainContent:e})},a.openPlotly=function(){"maincontent"!==a.state.mainContent&&a.setState({mainContent:"maincontent"}),a.setState({zPlotly:1,zLivecam:0,zVeggerLivecam:0,zVeggerPlotly:0})},a.openLiveCam=function(){"maincontent"!==a.state.mainContent&&a.setState({mainContent:"maincontent"}),a.setState({zPlotly:0,zLivecam:1,zVeggerLivecam:0,zVeggerPlotly:0})},a.openVeggerPlotly=function(){"maincontent"!==a.state.mainContent&&a.setState({mainContent:"maincontent"}),a.setState({zPlotly:0,zLivecam:0,zVeggerLivecam:0,zVeggerPlotly:1})},a.openVeggerLiveCam=function(){"maincontent"!==a.state.mainContent&&a.setState({mainContent:"maincontent"}),a.setState({zPlotly:0,zLivecam:0,zVeggerLivecam:1,zVeggerPlotly:0})},a.openEditProfile=function(){"editprofile"!==a.state.mainContent&&a.setState({mainContent:"editprofile"})},a.openResizeView=function(){"resizeview"!==a.state.mainContent&&a.setState({mainContent:"resizeview"})},a.openChart=function(){"chart"!==a.state.mainContent&&a.setState({mainContent:"chart"})},a.editChart=function(){window.open("https://docs.google.com/spreadsheets/d/1i7EDfBIwj4eYU2LxyS02YwDDeNROcdgXjROKfzCtp60/edit?usp=sharing","sharer","toolbar=0,status=0,width=548,height=325")},a.openConfig=function(){"config"!==a.state.mainContent&&a.setState({mainContent:"config"})},a.state={mainContent:"signin",UID:null,username:"",URL_livecam:null,URL_plotly:null,URL_vegger_livecam:null,URL_vegger_plotly:null,zPlotly:0,zLivecam:0,zVeggerLivecam:0,zVeggerPlotly:0,sFlowerTemp:"",sFlowerHumidity:"",sVeggerTemp:"",sVeggerHumidity:""},a.firebase=new f,a.firebase.auth.onAuthStateChanged(function(e){e&&(a.setState({UID:e.uid}),a.getUrls(),a.getUsername(),a.watchSensors())}),a.flowerTempRef=i.a.createRef(),a.flowerHumidityRef=i.a.createRef(),a.veggerTempRef=i.a.createRef(),a.veggerHumidityRef=i.a.createRef(),a.leftMenuRef=i.a.createRef(),a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this;return i.a.createElement("div",{className:"App"},i.a.createElement("header",{className:"App-body"},i.a.createElement("div",{id:"App-Inner-Body"},i.a.createElement("div",{id:"App-Body-Content"},function(){if(e.state.UID)return i.a.createElement("div",{id:"Main-Left-Wrapper",ref:e.leftMenuRef},i.a.createElement("div",{id:"Main-Left"},i.a.createElement("div",{id:"Home-Div"},i.a.createElement("img",{src:p.a,id:"Grovv-Logo",alt:"grovv logo"})),i.a.createElement("div",{id:"Main-Left-Menu"},i.a.createElement("div",{id:"Footer-Btns"},i.a.createElement("button",{id:"Profile-Btn",onClick:e.openEditProfile},"Profile"),i.a.createElement("button",{id:"Logout-Btn",onClick:e.handleSignOut},"Logout")),i.a.createElement("div",{className:"QuickTemp-Row"},i.a.createElement("button",{className:"Grow-Area-Btn",onClick:e.openLiveCam},"GG ",i.a.createElement("span",{role:"img","aria-label":"live cam"},"\ud83d\udcfa")),i.a.createElement("button",{className:"Temp-Gauge-Btn",onClick:e.openPlotly,ref:e.flowerTempRef},e.state.sFlowerTemp,"\xb0C"),i.a.createElement("button",{className:"Humid-Gauge-Btn",onClick:e.openPlotly,ref:e.flowerHumidityRef},e.state.sFlowerHumidity,"%")),i.a.createElement("div",{className:"QuickTemp-Row"},i.a.createElement("button",{className:"Grow-Area-Btn",onClick:e.openVeggerLiveCam},"VG ",i.a.createElement("span",{role:"img","aria-label":"live cam"},"\ud83d\udcfa")),i.a.createElement("button",{className:"Temp-Gauge-Btn",onClick:e.openVeggerPlotly,ref:e.veggerTempRef},e.state.sVeggerTemp,"\xb0C"),i.a.createElement("button",{className:"Humid-Gauge-Btn",onClick:e.openVeggerPlotly,ref:e.veggerHumidityRef},e.state.sVeggerHumidity,"%")),i.a.createElement("button",{className:"Left-Menu-Btn",onClick:e.openResizeView},"MULTI"),i.a.createElement("div",{id:"Left-Chart-Btns"},i.a.createElement("button",{className:"EditChart-Menu-Btn",onClick:e.editChart},"EDIT \u270e CHART"),i.a.createElement("button",{className:"Left-Menu-Btn",onClick:e.openChart},"CHART")),i.a.createElement("button",{className:"Left-Menu-Btn",onClick:e.openConfig},"CONFIG \u2699"))),i.a.createElement("div",{onClick:e.handleMenuHandle},i.a.createElement("img",{src:C.a,id:"Menu-Handle",alt:"menu handle"})))}(),function(){if(e.state.UID)switch(e.state.mainContent){case"editprofile":return i.a.createElement(b,{UID:e.state.UID,username:e.state.username});case"resizeview":return i.a.createElement(x,{urls:e.state.urls});case"chart":return i.a.createElement(S,null);case"config":return i.a.createElement(A,null);case"maincontent":return i.a.createElement("div",{id:"Main-Content"},i.a.createElement("object",{className:"Site-View-Update",style:{zIndex:e.state.zPlotly},type:"text/html",data:e.state.URL_plotly,width:"100%",height:"100%","aria-label":"plotly"}),i.a.createElement("object",{className:"Site-View-Update",style:{zIndex:e.state.zLivecam},type:"text/html",data:e.state.URL_livecam,width:"100%",height:"100%","aria-label":"live cam"}),i.a.createElement("object",{className:"Site-View-Update",style:{zIndex:e.state.zVeggerPlotly},type:"text/html",data:e.state.URL_vegger_plotly,width:"100%",height:"100%","aria-label":"vegger plotly"}),i.a.createElement("object",{className:"Site-View-Update",style:{zIndex:e.state.zVeggerLivecam},type:"text/html",data:e.state.URL_vegger_livecam,width:"100%",height:"100%","aria-label":"vegger live cam"}))}else switch(e.state.mainContent){case"signin":return i.a.createElement(y,{gotoSignUp:e.setMainContent,signIn:e.handleSignIn});case"signup":return i.a.createElement(E,{gotoSignIn:e.setMainContent});default:return i.a.createElement(y,{gotoSignUp:e.setMainContent,signIn:e.handleSignIn})}}()))))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(i.a.createElement(B,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},15:function(e,t,a){},58:function(e,t,a){e.exports=a.p+"static/media/corner-logo.5ece3763.png"},59:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAADjCAYAAABU+TDcAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAEVwAABFcB/VJptwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAABYqSURBVHic7Z17nBxVlce/p7onmZDHdHVeYBAGCZBMz0yACCwobEQFFHl/kJcIuIvgLouuKCAL4sKHRRB0UVgjfHi4ysONsiprlkeQRHmIEIRM90zAhGeAJZN090Agk5nuOvtHd88rM5N+1K3q7qnvP0lXd91zwo9769a9556DHeOeaDu7ElAXWMBpZDnXb0cC3MECUDgHEJ99CXABK//nhyMxFvnqSYArFARFhM/66UiAOwwIivIZH/0IcAlryN8PnhEj6psnAa4wVNBQWPmkb54EuII14lMw7NY4wwRV5XC/HAlwB2vE591nLmKeL54EuMJIQdEMB/vhSIA7bCeoQyBoLbOdoCIc4ocjAe6wnaAo+zU30+iDLwEusL2gMLlnKos99yTAFUYTFIJht2YZXVCHj3rsR4BLjNVDWz32I8AlRhcU9mY+kz31JMAVxhI0bE9hb089CXCFsQQFJxh2a5GxBYWYZ14EuMZ4ggY9tAYJBK0zwuN8twfzmRxtZE4mS+O7XfzVM68Cyma8HmrZkzlAlVWWxd0Ecbs1wXiCAiwD9hA4YObCIN6oFtiRoDsX/uJYXGDYlwAX2JGgQ/lsZF8ixjwJcIVSBG2w+jjCmCcBrlCKoKhwqClHAtyhJEGBfY14EeAapQq60IgXAa5RqqBRloy7GBHgM6UKKtOS+QNNMSa5705ApZQqKA3K3EgrN9jQRbB6VHWIHUNLvKcHaALAoj3VQYfrXgWUTck9lIKYAFna3XMlwA3KEXQQoc0lPwJcojJBodkNJwLco1JBp7niRYBrVCroVFe8CHCNigSVoIdWHRUJqkEPrTqCIbfOqFTQrCteBLhGpUNuv1uOBLhDpZOiAUEjC2i2W/l5tJXvVOxVQNlUOuT2A2K3cr6EWINyhsIBbjgWUB6V7W0KYTvGcpSjBq4pdqVOBZRPZYIqrYw4MiHQUFGbARVR6ZC7HQ4lb8cFuIjrglrwrtttBhSP64Kq8J7bbQYUj+uCokEP9RPXBRVIud1mQPG4PylSXnC7zYDicb+HKs+43WZA8bgt6Aepuax1uc2AEnBXUGElK8kUPuazY7s/8QoYE7f/Y98LMLedqXYL1zgZ1jctDA44eYmb51S2hvr5TSTGsX1Zbkb4cN5AUAvGQ9wUdFW2gdtFOXnoxazFTi7aCNgBbgp61GiruFawWO8pxics4tBj2kbAIOZnoFawFOglxgXNWGwybSNgENOCvt/TwauGbQQMwbSgccAxbCNgCEYFFfiTyfYDtseooJrLFRjgISYFfSOV4CmD7QeMgjFBBa4GnKZW9oy2cocdY6UpWwGDmMo51KnwULSFm1Q5X2ES8IEhWwFDMCXobsArKsNGgGCBwQNMCTraQeAgNMUDvEvzpqz2zNbEwYq0crylfEHhzVSCf/JMULV41itb9U5zM4090zgb5SKU+QqIk6vM7JWgmUwDj3tkq35ZQjjazTk9cAWaCyAAQPh1siu3iOOJoAKrtvyFbi9s1SlixzhFurlKYa8R321z4BuFD1710P/yyE7d0dTGYsvhJuBjo54CU27sSbC+8NELQbN9IX7tgZ26YtZCdnEsrlWHLzJ21tOXJ4X5t6EXvBD0kS1r2OiBnfog95y8MAv/yvh5oBy1+NI7a3h/6EXzggq3GLdRJzQtZP9QN7cqOy5qL8rNqQ5WjbxuWtC1qTjLDduoeT60mJ0+2MZVonxVi9NkXUOYy0b7wrSgVwPO3Ham9mW4UIXZ6QRfN2yzamlqZc+QchxwdFg4fWOcd+wWDt3ay08F9iiymYwIZ40caguUk9G6KBReSkObrZyD8B1yZbdeTiXY04S9aia6kL9Ri0uBY8jvcE1pZGpvL5cqXAaEim5MuDwV55qxvjbWQwW6bViDsM+Qy/UedC3EaCBBH8C0duY0ZLhRhS+M/OHWXh4H9iutcR5Nxrl2vN+Y3OD+GAwTE2CLQXu+EmnhODtG3FYuAoi0sqQhSyejiJmnVDE3Wg5nsoMYLW9rsAgveWrPA+zFNEkv/65wNgDCQZEWzhFlKbhWCsUBztrUxds7+qGngqrytJf2TNO0kP3p5Zc6fEJztAjHuWpI+HYyzoPF/NTTs5shqb2gMTvGqdGW4QewACIxzrIsHmf72amrnUThV6n48NWg8fBS0Kc3x+ny0F5lnEzIjnELcK8K5wz5RiIxbhS4C5hi1Ach3pAbyot+E/FuP1THn51VFYtpiHZyn8KJ+Su5CUyMSbZwB8oZHnix2YHjuxOlTSSNvYcOReGZdIKDqIW0cUsI25u4hxHnXEMZ5mXD3AEc6YEXferw6XQXfyj1Ri+G3AzKedSCmIDdzS0jxQTIhnkWb8QEeMyyWNC0kP1LvdH8+VC4Nt3JX0zbKRW7laMjLcOejURa+Srw5TFu2cW8VwMcqfATCfHxUm80Lej/JhPVl+E62so3UH6LxekD11qIiXK9n36NYEs2w92l3mRyUtSVyXJmNMYCFfZHmZdKcD0+D72RGDeq5jYIRAeGNEuFW3FvIaByhB+9t5bNJd9mcFKUJDetH5jaZ2GvdxOsM2Rvh0RjXKVwxdBr6tBsWRyhcKtffo3Cq5NCtI61ozIeJnvoyHQ2Tnibf5ELkRbOGSkmgFgcrHClHz6NQQbli+WICV4uLAidyXXeHIdoauMjs2OD4Rt2G20yduTEJcA8L/wqBoGLU538sdz7vVwpeswLI5EYn7AcXuiHr+UvCQ5LGXtVp2oynalwYzLBDyppwzNBnSx3mbYxawF7C/wKmCb5d8ZIKycAh5i2XSmq3JGO881K2/FGUOG5ni6eM2pjMQ3ZEL+EgTIjB9mLaRId872ymnDE4plZC7YLoi4ZTwQV5Sembdjb+CYMKyHdwDYuAD5l2rYLWCg/dkL8cdp+zK6kIS/Wct9IbWMv1rHNlIGmVva0lDjQOOIrZewg5Wqj34GjehL8vpJGzPdQ4VqTYgJYytVsL2bOeo2g8OVKxQTzgr6e6uUONxu0F9MUWTBYzD0SYxFwips2fOCSdMKdSaPpPEXXsCtZO8ZpM2McWGl7MxayF72sJsQNhWtWblGgZrNmC1yVXxJ1BZMrRd2A2t10AfMdeJgKtp+i7eyqWf4A7CwwiyWEo0l21izHuuWwD1yXTLi7SmVS0Nkj1kenl91SjElOlvslF6wN0DSzm/1UOJpSgpSrCIGrkwm+7Xa7Xkb9vVLujRHhfNHhdUmzcKRoPnSytlDgW8kE15lo3EtBy8oqNjvGtIxy+cjrApcDkyv2ylu2AOemEtxnyoBXkwlVhwfKuTEjHA+jvmzXmpgAryjsHG0hZsqAV4I+ke7itTLvPc1VT/ylTeAHKsTtGG9HY+7HKHkl6I+L/WFzM41z25ma/2ihHGbIJ7/JWA5r3G7Ui2foK6nG4iLmm5tp7JnKn3AINTdzQGoa89Bxj6XXKm+HQnxqU2LHZ1VKxbigIlzDavqL+W3PNL6OsgiFnmlcZNVnOrkXNctRmxJmUrebXilanVxY3JLWzEXMQ/nWwAXlX1D+3pRvPvE7x+Lg9FpzefhN9tCMwFdYRraYHzsZLmN41o8p4PIpLv/oUeWKdCc3Yzjq0VwPFa7cnCiulqi9mCbgi8Z88Q8F/rNB2CfdyY/wIITVSA/NHx3/brG/122cJePn5Kk1tqD8XIQfJRN0emnY1Ab3VoENwBsoS5Odw2e5s/ZheibMiekEPyV3PG+twN4G/PCDToUL0glW4kNQuRcRC7emEpxX+DBrH6Znw6wid0Tv4yJMVeUhwz74wZsI/+M4LOvp5Pd4JK75hQUdludPMmHuZDBhxKmq/KNxH/xhHsp5lrDCbuVor4wa7aECf00mWEA+c0eklRNEuX/IT94nFzpSk1tgRXJ9KsElXhkz2kMd4WYKaVhOJiS6XcKkqdSvmFmEi70UE8y+h75n9Q4uKkTiHIPFQoP2qoluEb6QjPOw14ZNFuK5fehZFrH4kilbVcY9DUKbH2KCuR7qZBg8HDQjRhT4jCFb1YCD8KDC99JxfytImRJ0+dBzoJbDYVgeZy3zABVWoNyNw2MV7Pe6ipEhV4QfzmllbmRfIgCWxRITdvxGlAMEFmuYWX77UsDEa0unNvAx6ed5wMLiaHW4XRge5FWHPB5y+Hwx+fhM4vowKHA//VwH7A6Aw2qBBrftVCHT+yyzRz6KwZPEU3VORuCWxkYue2u1/xUY626i4jErsbgw2UGH344UCAQtHQdYbjnctLmLR6myDGmBoMWzXuBeQvwkuYYNfjszFoGg4yE8h7JMlAeSnST8dqcYAkHHQ7EVGhDe89uVYglmucXhAE+Iw8WFso7VSs0elPUYC9hfw+Vl9/KSQNDi2GQpn0xV0evJWASCjo8j8NP+ELHNnbVR0SKYFI3OWuC3jnBrT3yw2GotMNEFVeBnCutR3lB4fbJFfGOcd/x2rFwmuqCisMASLk8meMNvZ9xgwj9DBQ5U5elIrHqyclbChBc0z1y0tOJy1UogKDwlwqHpTu702xE3mKjP0HeB+8Thzmpf+SmViSKoA6xBWSHCip1m8IcNT7HVb6dMMBEEfdOCE4aeVU366Y1hJsIzdJ4DT0djrGhqrf/63xNBUMi9b34iJMzx2xHTTBRBNwuckuwoLz1dLVHvz9AUwtJMH99/7yU2+e2MF9SjoBtQVqrFf0e2sPzVV+n12yEvqXlBBe534AFR1oeFv3Yn+L/Cd2k/HfOJmhdUYUF6G6ebLlRQK9TDpKjFnsxX/XaiWqj1HpoW+E1W+JXfjlQLtShoEvgdsCy1jYeDoXY4tSLoZpRlavELwjxv9fNJ4PDIJDakydX3jsZoUeUMhCXAhwU27jSDQ4et2Z5MKNrJPo7D3uEGujat4UV//jnmqAVBU5ks+4RgOhYXSD+/VmgCQFk1O8bbGeEGVU5DBucECndveIqt0xcwMxTmDFFOpZNFCjuJBVmHz0EgqB9saQhxq8Kx6HB/LYtwBlajfGjkPQpP2THuA45Hh+enV3gpPZmHI60sQTnMEppVma0wRwRH4Eq/kl5USq1HzmcpI8+RwjOSK0s5f5SvU2FoGfo+W0vUQg8dj7KSVu0gPcAVmUa2Rlv4vFrsK8ouKsxRmCTQJ8pqEwV03KLWBXUbBziJXn6gQgOaP/ypg2UOHfiFf+7tmFofcr3mF6kEp/rtxHgEgpbGFhgoiLCV3HJxGkgBCYS7U3H3S3eUQjDklsbQrNs2DJtdH60OT4K/ggY91D36EJ4DkigbBJ51sjxisgLEaASCmkUFHnPgonSC570wWA+7LdWMKBxiOaPWBzdjMOihxnGALpS/IHSgdCAkUgleN2EsENQ/3lXhzxY8IVken76Vx90IlwkErR62AqtUWa4Wy8s9aBwIWr10qrI0X5GpaIJJUXWyHlhlaXGlxoYydGGhA2hzzaWAYnGAFwX+DDyZtVjR08HL5TYWJlc7ZarAncClSv0fF/CRdxXWWrlyWl2OsjrUxzNDiy1USph8cXJHeM1SlgNnu9V4AACvOcrfhcK86EXSR4v8sBtSNjjCb00bnIA0ibDZqwyeA8/QbJaNDSE6M9AL3q1s1BsK71iwQYUn1eHRnabwiJeZrgcEDSubuxNssWM8Rn3XWDHFpkw/C0ceivL6OEbhtaVv04v5FKLCAx77UOtsFdgIrA83sMBvZwo9dOCUulg8oFluYTDqIqCAcpkTYmnhY89M3mMlGT9dGkmhh24uXEiuYQOSC16egCQQlgN9o34rfBOgp4NUTwepahMTRumhAOpwswh3kPuHTfLAj2pZ1Ng7ZHGS8wFv08hn1KEdoRnYXXITRQ0pB0D1xuwWBB02C0vP4Wf2RvpEOFHhRJMOCGxMzmb/yCb+IV9fdNqI7x9VOJTt/8dKAq/BqBnAOoB5QHQMs5cgHIxyDMNDQRuyWb6XWsex5KL7qjrCbzQKQ27/sKsryaQ6uVuVtQZtvwyc7mQ5iJVk0nF+CMTIVTUcmjn6CSvMR4DrgZ4h13unNPJxYbBG6RAmTQqxm8I5mltSG4bAQak4J4iwh8LZKDcgLAMeAtRenD9qUYOIHUMF7k8mOGnkl3Yrn0ONzXrfJ9fD1iE8GFZ+1p1gC0BTG3ZIOQKHQxDiyQS3AUTnM0Mncya516pdU4lcwsV8jevvorQO/MOUzyc7WQZgt9GGcgzKZ4F2YGrIYVe/65SZoLB9dl8qwWkjv2xqw7YcNuHNrsxbjnBcT5xny20g2sbBqixCaXIcHunp4rnRfhfZl0j6+fo8sV94ho46q+vpIBWN8ZjmzoDsbtQTYV1IKyvbmE9bs8PUNfUqJuR7nurY0+8Z7/O5MLSCezsCo6AoaQd2LtQcDSgPC0Cs4cfthvLqq/Tmn213G/RDgGMF7pR+NkRbuGlae7CNVw6FHrrDxXiBm/GmcNtUFS5syLJ2Zqzui8i6Tq6HFrG7kkzQCXxL4UrjXsGbAuduTrDaA1t1hdgxVIUV6TifLuqOxTTYvbwNzDTrGutQbkj1cVeQGKN4cj20iCF3gNX0I9xjzKNB5iMstSfzzMw2/3cxaoXC+2VJrwtWiOvILQykGLnK5D5tjsOfIwtoNmynLigIOreUmza/wJsCZ6H8WOE3BvwaQOF2zdLu9SmuWqWwUqSpbUwp51k1s4WDHDGeiP8hga/nJ2YB42CRiwsVe3JpvbTA5k6eVmEF5HZO3HRuCEcqPBeN8c8EG+/jYkGuzpdV4rA7FIGLgHsd5VK3HBuFyQrfj8S40aCNmics8JbCLg7sXG4j+bwCp0fb2VWzOBhazBd4FmqrWqDXWApvAgjsUmlj+fCVQmxvEpdXlhT2tLT83ZiJgKWaCzt0tHJBAUIWl5LLFnIb7odq2I7wyMwYB7rcbt1gWfkK8FLBkDuUTWt4URw+7Qi3iRh53k134MFIjEUG2q55LBiIx3WlhwIku/hTT5z1yTiP5KPo3Ma2YNmHFrOTgbZrGkvzgqoLz9BRUb5CzsYD4Op7ZMdbqydWxYdisHB5yB1JKsHrCKcJ/IcI55LLoAkVLhkqnBht5eTKPawvBofcnKBGXtpTcX6XTPBgMs6TCBfkLyfIRdmVjSq3RhYaDo2pMSx1BgSdNDvGVNMGU3GWApcAL2qW88kt8JfLDLG42B3P6gNLZUBQevu9OUaYSnB9qpEz02t5VeEkBoPUSg2r3CbKKpfdq2mskAxOLBoaPTwXujr3DE0neEyF04CM5iZQ11H8gsRkhPNYEiShLGBlZXCHRbP+ZEVJx7lf4Yisw+OpBJeKcgrDo+THROFweyPXGnaxZhC7jTacXErQ/hBzt6wxtmNSEnaM3QTu1NzW2ckKHx3n5ypwcjIRFOSRWe3sk83mzrCEMswYOPhbHQiLCTMdjXRzgcDXyBXhaQGWjPjtu6EQB9ZjLZZSkKZ29rCyvAz0pxJMxptQzXKxiBEmQX8kxpnA9TJ82y8xpZEDvcxpUG2EdplCb3+YVU6Iu3o3Vn2Yh9KdW5jo7eaFKbtxm2SYQm44toA52QzTtnbzoK9eBlSG3UZbNMYKO4baMbKRhRzmt08BLhBp428jrTxix3iOII9h/TAjxvyJuhPz/wz+dsNJh1heAAAAAElFTkSuQmCC"},60:function(e,t,a){e.exports=a(120)},65:function(e,t,a){}},[[60,1,2]]]);
//# sourceMappingURL=main.c9ecb4d9.chunk.js.map