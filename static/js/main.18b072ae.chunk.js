(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{118:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),l=a(45),s=a.n(l),o=(a(64),a(3)),r=a(4),c=a(6),u=a(5),d=a(7),m=(a(18),a(24)),g=a.n(m),h=(a(111),a(115),{apiKey:"AIzaSyBJuUseKfGN_MjNEWg722WY1FsO2xZ1AuE",authDomain:"grovv-22cbd.firebaseapp.com",databaseURL:"https://grovv-22cbd.firebaseio.com",projectId:"grovv-22cbd",storageBucket:"grovv-22cbd.appspot.com",messagingSenderId:"30272449560"}),v=function e(){Object(o.a)(this,e),g.a.apps.length||g.a.initializeApp(h),this.db=g.a.database(),this.auth=g.a.auth()},p=a(58),f=a.n(p),S=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).handleUsernameChange=function(e){a.setState({username:e.target.value})},a.handlePasswordChange=function(e){a.setState({password:e.target.value})},a.handleSubmit=function(){console.log("SignIn submit pressed");var e=a.state.username,t=a.state.password;console.log("SignUp submit pressed - username ".concat(e)),a.validateEmail(e)?(a.setState({username:"",password:""}),a.hideSigninFields(),a.firebase.auth.signInWithEmailAndPassword(e,t).catch(function(e){var t=e.code,a=e.message;console.log("".concat(t,": ").concat(a)),alert("".concat(t,": ").concat(a)),this.setState({SHOWFIELDS:!0})}),console.log("username ".concat(e," - logged in")),a.props.signIn("songwall")):alert("Bad email me thinks :(")},a.hideSigninFields=function(){a.setState({SHOWFIELDS:!1})},a.showSigninFields=function(){a.setState({SHOWFIELDS:!0})},a.state={username:"",password:"",SHOWFIELDS:!1},a.firebase=new v,a.firebase.auth.onAuthStateChanged(function(e){e||a.showSigninFields()}),a}return Object(d.a)(t,e),Object(r.a)(t,[{key:"validateEmail",value:function(e){return/^\S+@\S+$/.test(String(e).toLowerCase())}},{key:"validatePassword",value:function(e){return/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(String(e))}},{key:"render",value:function(){return this.state.SHOWFIELDS?i.a.createElement("div",{id:"signin-div"},i.a.createElement("h3",null,"Sign In"),i.a.createElement("div",null,"Email:",i.a.createElement("input",{id:"signin-username",value:this.state.username,onChange:this.handleUsernameChange})),i.a.createElement("div",null,"Password:",i.a.createElement("input",{type:"password",id:"signin-password",value:this.state.password,onChange:this.handlePasswordChange})),i.a.createElement("div",null,i.a.createElement("button",{id:"submit-signin-btn",onClick:this.handleSubmit}," Sign in! "))):i.a.createElement("div",null,"One Moment...")}}]),t}(n.Component),b=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).hideSignupFields=function(){a.setState({SHOWFIELDS:!1})},a.showSignupFields=function(){a.setState({SHOWFIELDS:!0})},a.handleUsernameChange=function(e){a.setState({username:e.target.value})},a.handlePasswordChange=function(e){a.setState({password:e.target.value})},a.handleSubmit=function(){var e=a.state.username,t=a.state.password;return console.log("SignUp submit pressed - username ".concat(e)),a.validateEmail(e)?a.validatePassword(t)?void a.firebase.auth.createUserWithEmailAndPassword(e,t).catch(function(e){var t=e.code,a=e.message;console.log("".concat(t,": ").concat(a))}):(alert("Bad password. Must be 7-15 characters with at least 1 numeric digit and a special character."),void a.setState({password:""})):(alert("Bad email me thinks :("),void a.setState({username:""}))},a.handleGotoSignIn=function(){a.props.gotoSignIn("signin"),console.log("Goto signin pressed")},a.state={username:"",password:"",SHOWFIELDS:!1},a.firebase=new v,a.firebase.auth.onAuthStateChanged(function(e){e?a.postUserToFirebase(e.uid,e.email):a.showSignupFields()}),a}return Object(d.a)(t,e),Object(r.a)(t,[{key:"postUserToFirebase",value:function(e,t){var a=(new Date).getTime(),n={uid:e,username:t,createdAt:a,updatedAt:a},i={};return i["/users/"+e]=n,this.firebase.db.ref().update(i)}},{key:"validateEmail",value:function(e){return/^\S+@\S+$/.test(String(e).toLowerCase())}},{key:"validatePassword",value:function(e){return/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(String(e))}},{key:"render",value:function(){return this.state.SHOWFIELDS?i.a.createElement("div",{id:"signup-div"},i.a.createElement("h3",null,"Sign Up"),i.a.createElement("div",null,"Email:",i.a.createElement("input",{id:"signup-username",value:this.state.username,onChange:this.handleUsernameChange})),i.a.createElement("div",null,"Password:",i.a.createElement("input",{type:"password",id:"signup-password",value:this.state.password,onChange:this.handlePasswordChange})),i.a.createElement("div",null,i.a.createElement("button",{id:"submit-signup-btn",onClick:this.handleSubmit}," Sign up! ")),i.a.createElement("div",null,i.a.createElement("button",{id:"goto-signin-btn",onClick:this.handleGotoSignIn}," Sign in! "))):i.a.createElement("div",null,"One Moment...")}}]),t}(n.Component),E=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).handleUsernameChange=function(e){a.setState({username:e.target.value})},a.handleSubmit=function(){},a.handleChangePassword=function(){alert("Sorry - request from reset admin for now.")},a.state={username:""},a.firebase=new v,a}return Object(d.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return i.a.createElement("div",{id:"Profile-Page"},i.a.createElement("div",{id:"Profile-Page-Header"},i.a.createElement("div",null,"Email: ",i.a.createElement("b",null,this.props.username)),i.a.createElement("button",{onClick:this.handleChangePassword},"Change Password")))}}]),t}(n.Component),w=a(25),y=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={width:40,height:40,x:150,y:200,URLS:a.props.urls},console.log(a.props.urls),a}return Object(d.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){return i.a.createElement("div",{id:"Test-Resize-Draggable-Page"},i.a.createElement(w.a,{className:"test1",default:{x:0,y:0,width:320,height:200}},i.a.createElement("div",{className:"moveHandle"},"\u2904"),i.a.createElement("object",{className:"Rnd-View",style:{zIndex:this.state.zPlotly},type:"text/html",data:this.props.urls.plotly,width:"100%",height:"100%","aria-label":"plotly"})),i.a.createElement(w.a,{className:"test1",default:{x:20,y:20,width:320,height:200}},i.a.createElement("div",{className:"moveHandle"},"\u2904"),i.a.createElement("object",{className:"Rnd-View",style:{zIndex:this.state.zLivecam},type:"text/html",data:this.props.urls.livecam,width:"100%",height:"100%","aria-label":"live cam"})),i.a.createElement(w.a,{className:"test1",default:{x:40,y:40,width:320,height:200}},i.a.createElement("div",{className:"moveHandle"},"\u2904"),i.a.createElement("object",{className:"Rnd-View",style:{zIndex:this.state.zVeggerPlotly},type:"text/html",data:this.props.urls.vegger_plotly,width:"100%",height:"100%","aria-label":"vegger plotly"})),i.a.createElement(w.a,{className:"test1",default:{x:60,y:60,width:320,height:200}},i.a.createElement("div",{className:"moveHandle"},"\u2904"),i.a.createElement("object",{className:"Rnd-View",style:{zIndex:this.state.zVeggerLivecam},type:"text/html",data:this.props.urls.vegger_livecam,width:"100%",height:"100%","aria-label":"vegger live cam"})))}}]),t}(n.Component),C=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).getUsername=function(){a.firebase.db.ref().child("users").child(a.state.UID).on("value",function(e){a.setState({username:e.val().username})},function(e){console.log("The username read failed: "+e.code)})},a.getUrls=function(){a.firebase.db.ref().child("users").child(a.state.UID).child("urls").on("value",function(e){a.setState({URL_livecam:e.val().livecam,URL_plotly:e.val().plotly,URL_vegger_livecam:e.val().vegger_livecam,URL_vegger_plotly:e.val().vegger_plotly,urls:e.val()})},function(e){console.log("The url read failed: "+e.code)})},a.handleSignOut=function(){a.setState({UID:null,URL_livecam:null,URL_plotly:null}),a.firebase.auth.signOut().then(function(){console.log("signed out")}).catch(function(e){console.log("Error signing out: ".concat(e))})},a.handleSignIn=function(){a.setState({mainContent:"maincontent"})},a.setMainContent=function(e){a.setState({mainContent:e})},a.openPlotly=function(){"maincontent"!==a.state.mainContent&&a.setState({mainContent:"maincontent"}),a.setState({zPlotly:1,zLivecam:0,zVeggerLivecam:0,zVeggerPlotly:0})},a.openLiveCam=function(){"maincontent"!==a.state.mainContent&&a.setState({mainContent:"maincontent"}),a.setState({zPlotly:0,zLivecam:1,zVeggerLivecam:0,zVeggerPlotly:0})},a.openVeggerPlotly=function(){"maincontent"!==a.state.mainContent&&a.setState({mainContent:"maincontent"}),a.setState({zPlotly:0,zLivecam:0,zVeggerLivecam:0,zVeggerPlotly:1})},a.openVeggerLiveCam=function(){"maincontent"!==a.state.mainContent&&a.setState({mainContent:"maincontent"}),a.setState({zPlotly:0,zLivecam:0,zVeggerLivecam:1,zVeggerPlotly:0})},a.openEditProfile=function(){"editprofile"!==a.state.mainContent&&a.setState({mainContent:"editprofile"})},a.openTEST=function(){"TEST"!==a.state.mainContent&&a.setState({mainContent:"TEST"})},a.state={mainContent:"signin",UID:null,username:"",URL_livecam:null,URL_plotly:null,URL_vegger_livecam:null,URL_vegger_plotly:null,zPlotly:0,zLivecam:0,zVeggerLivecam:0,zVeggerPlotly:0},a.firebase=new v,a.firebase.auth.onAuthStateChanged(function(e){e&&(console.log("UID: ".concat(e.uid)),a.setState({UID:e.uid}),a.getUrls(),a.getUsername())}),a}return Object(d.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this;return i.a.createElement("div",{className:"App"},i.a.createElement("header",{className:"App-body"},i.a.createElement("div",{id:"App-Inner-Body"},i.a.createElement("div",{id:"App-Body-Content"},i.a.createElement("div",{id:"Main-Left"},i.a.createElement("div",{id:"Home-Div"},i.a.createElement("img",{src:f.a,className:"Grovv-logo",alt:"grovv logo"})),function(){if(e.state.UID)return i.a.createElement("div",{id:"Main-Left-Menu"},i.a.createElement("div",{id:"Header-Btns"},i.a.createElement("button",{id:"Profile-Btn",onClick:e.openEditProfile},"Profile"),i.a.createElement("button",{id:"Logout-Btn",onClick:e.handleSignOut},"Logout")),i.a.createElement("button",{className:"Left-Menu-Btn",onClick:e.openLiveCam},"GanjaGrove Live"),i.a.createElement("button",{className:"Left-Menu-Btn",onClick:e.openPlotly},"GanjaGrove Plotly"),i.a.createElement("button",{className:"Left-Menu-Btn",onClick:e.openVeggerLiveCam},"Vegger Live"),i.a.createElement("button",{className:"Left-Menu-Btn",onClick:e.openVeggerPlotly},"Vegger Plotly"),i.a.createElement("button",{className:"Left-Menu-Btn",onClick:e.openTEST},"TEST"))}()),function(){if(e.state.UID)switch(e.state.mainContent){case"editprofile":return i.a.createElement(E,{UID:e.state.UID,username:e.state.username});case"TEST":return i.a.createElement(y,{urls:e.state.urls});default:return i.a.createElement("div",{id:"Main-Content"},i.a.createElement("object",{className:"Site-View-Update",style:{zIndex:e.state.zPlotly},type:"text/html",data:e.state.URL_plotly,width:"100%",height:"100%","aria-label":"plotly"}),i.a.createElement("object",{className:"Site-View-Update",style:{zIndex:e.state.zLivecam},type:"text/html",data:e.state.URL_livecam,width:"100%",height:"100%","aria-label":"live cam"}),i.a.createElement("object",{className:"Site-View-Update",style:{zIndex:e.state.zVeggerPlotly},type:"text/html",data:e.state.URL_vegger_plotly,width:"100%",height:"100%","aria-label":"vegger plotly"}),i.a.createElement("object",{className:"Site-View-Update",style:{zIndex:e.state.zVeggerLivecam},type:"text/html",data:e.state.URL_vegger_livecam,width:"100%",height:"100%","aria-label":"vegger live cam"}))}else switch(e.state.mainContent){case"signin":return i.a.createElement(S,{gotoSignUp:e.setMainContent,signIn:e.handleSignIn});case"signup":return i.a.createElement(b,{gotoSignIn:e.setMainContent});default:return i.a.createElement(S,{gotoSignUp:e.setMainContent,signIn:e.handleSignIn})}}()))))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(i.a.createElement(C,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},18:function(e,t,a){},58:function(e,t,a){e.exports=a.p+"static/media/corner-logo.5ece3763.png"},59:function(e,t,a){e.exports=a(118)},64:function(e,t,a){}},[[59,1,2]]]);
//# sourceMappingURL=main.18b072ae.chunk.js.map