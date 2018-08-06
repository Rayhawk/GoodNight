var login_proc_count = 1;
var naver_id_login = undefined;
var _deailyFlog = false;
var gubun = '';

$.fn.login = function() {
	deailyFlog = arguments[0] ? arguments[0] : false;

	// 운영 용
	snsKey = {
		'kakao' : {
			'key' : "e8ec9d47f3e1eaa8121a6acdcc43f81a"
		},
		'naver' : {
			'key' : "aTrVlz9Dw4_83csoP0DF",
			'callback' : 'http://' + location.host
					+ "/common/callback/naver.html",
			'state' : ""
		},
		'facebook' : {
			'key' : "660791344270515"
		},
		'gplus' : {
			'key' : "914686837459-kib0kk2pp012thu9u6tcll8o162h2ccb.apps.googleusercontent.com"
		},
		'twitter' : "twitter key"
	};

	window.fbAsyncInit = function() {
		FB.init({
			appId : snsKey.facebook.key,
			status : true,
			cookie : true,
			xfbml : true
		});
	};

	var script = undefined;
	// 카카오톡 API URL
	script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "//developers.kakao.com/sdk/js/kakao.min.js";
	document.getElementsByTagName("head")[0].appendChild(script);

	// 네이버 API URL
	script = document.createElement("script");
	script.src = "https://static.nid.naver.com/js/naverLogin_implicit-1.0.2.js";
	script.charset = "utf-8";
	document.getElementsByTagName("head")[0].appendChild(script);

	// 페이스북 API URL
	script = document.createElement("script");
	script.async = true;
	script.src = "//connect.facebook.net/en_US/all.js";
	script.charset = "utf-8";
	document.getElementsByTagName("head")[0].appendChild(script);

	// 구글 API URL
	script = document.createElement("script");
	script.async = true;
	script.src = "https://apis.google.com/js/client:plusone.js?onload=render";
	scripttype = "text/javascript";
	script.charset = "utf-8";
	document.getElementsByTagName("head")[0].appendChild(script);
	$("body").ready(function() {
		setTimeout(function() {
			// naver_id_login = new naver_id_login(snsKey.naver.key,
			// snsKey.naver.callback);
			// snsKey.naver.state = naver_id_login.getUniqState();

		}, 100);

	});

	$(this)
			.click(
					function(e) {
						var self = $(this);
						if (this.nodeName.toLocaleLowerCase() == 'a') {
							gubun = self.data('gubun');
							switch (self.data('type')) {
							case 'kakao': {
								// alert('카카오');
								Kakao.cleanup();
								Kakao.init(snsKey.kakao.key);
								Kakao.Auth
										.login({
											success : function(authObj) {
												var login_info = {};
												login_info["snsType"] = "KAKAO";
												login_info["token"] = authObj.access_token;
												Kakao.API
														.request({
															url : '/v1/user/me',
															success : function(
																	res) {
																login_info[""]
																login_info["id"] = res.id;
																login_info["email"] = res.kaccount_email;
																login_info["name"] = res.properties.nickname;
																login_info["nickname"] = res.properties.nickname;
																//snsLoginCallBack(login_info);
															},
															fail : function(
																	error) {
																alert('카카오톡 로그인 실패');
															}
														});
											},
											fail : function(err) {
												alert('카카오톡 로그인 실패');
											}
										});
							}
								;
								break;
							case 'naver': {
								window
										.open(
												"https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id="
														+ snsKey.naver.key
														+ "&redirect_uri="
														+ escape(snsKey.naver.callback)
														+ "&state="
														+ snsKey.naver.state,
												'naverloginpop',
												'titlebar=1, resizable=1, scrollbars=yes, width=600, height=550');
								// alert('네이버');
							}
								;
								break;
							case 'facebook': {
								// alert('페이스북');
								FB
										.login(
												function(response) {
													var login_info = {};
													login_info["snsType"] = "FACEBOOK";
													login_info["token"] = response.authResponse["accessToken"];
													if (response.status === 'connected') {
														// Logged into your app
														// and Facebook.
														login_info["id"] = response.authResponse["userID"];
														FB
																.api(
																		'/me',
																		function(
																				response) {
																			login_info["name"] = response.name;
																			login_info['nickname'] = response.name;
																			//snsLoginCallBack(login_info);
																		});
													} else {
														'into this app.';
													}
												},
												{
													scope : 'public_profile,email'
												});

							}
								;
								break;
							case 'gplus': {

								render();
							}
								;
								break;
							case 'twitter': {
								// alert('트위터');

								var newWindow = window
										.open(
												'http://members.edaily.co.kr/version2010/member/social/twitter.asp?redirectUrl='
														+ window.location.origin
														+ '/member/twitLogin.html',
												'twitLoginpop',
												'titlebar=1, resizable=1, scrollbars=yes, width=600, height=550');
								newWindow.focus();

								// alert('네이버');
							}
								;
								break;

							}
						}

						return false;
					});
}
function render() { // 로그인 버튼 지정
	gapi.signin.render('gplus', {
		'callback' : 'signinCallback', // 버튼 클릭 시 실행할 function
		'clientid' : snsKey.gplus.key,
		'cookiepolicy' : 'single_host_origin',
		'requestvisibleactions' : 'http://schemas.google.com/AddActivity',
		'scope' : 'https://www.googleapis.com/auth/plus.login'
	});
}
var google_access_token = "";
function signinCallback(authResult) { // 지정한 버튼 클릭시
	if (authResult['access_token']) {
		google_access_token = authResult['access_token'];
		// 승인 성공
		var idToken = authResult['id_token'];
		gapi.auth.setToken(authResult); // 반환된 토큰을 저장합니다.
		getEmail(); // 토큰저장했으니 프로필 정보 가지러 ㄱㄱ
	} else if (authResult['error']) {
		// 오류가 발생했습니다.
		// 가능한 오류 코드:
		// "access_denied" - 사용자가 앱에 대한 액세스 거부
		// "immediate_failed" - 사용자가 자동으로 로그인할 수 없음
		/* alert('오류 발생: ' + authResult['error']); */
	}
}
function getEmail() {
	// userinfo 메소드를 사용할 수 있도록 oauth2 라이브러리를 로드합니다.
	gapi.client.load('oauth2', 'v2', function() {
		var request = gapi.client.oauth2.userinfo.get();
		request.execute(getEmailCallback);
	});
}
function getEmailCallback(obj) {// 프로필 정보는 넘겨받은 obj값들중 선택하여 뽑아내면 됨.
	var login_info = obj;
	login_info['snsType'] = "GOOGLE";
	login_info['token'] = google_access_token;
	login_info['nickname'] = obj.name;
	login_info['name'] = obj.name;
	login_info['id'] = obj.id;
	/*snsLoginCallBack(login_info);*/
	disconnectUser();// 정보 다가져왔으니 자동 구글 로그아웃
}
// 구글 로그아웃
function disconnectUser() {
	var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token='
			+ google_access_token; // 로그아웃을 위해서는 저URL에 그냥 토큰값만 추가해서 날려주면된다.
	// 비동기 GET 요청을 수행합니다.
	$.ajax({
		type : 'GET',
		url : revokeUrl,
		async : false,
		contentType : "application/json",
		dataType : 'jsonp',
		success : function(nullResponse) {
			// 성공
		},
		error : function(e) {
			// 오류 처리
			// 실패한 경우 사용자가 수동으로 연결 해제하게 할 수 있습니다.
			// https://plus.google.com/apps
		}
	});
}
/*function snsLoginCallBack(login_info) {

	var url;
	var ret;
	var jsontext = {};
	jsontext['Div'] = 2;
	jsontext['UserID'] = "";
	jsontext['SNSDiv'] = login_info["snsType"];
	jsontext['SNSKey'] = login_info["id"];
	jsontext['LoginCnt'] = login_proc_count++;// "1";//ip();

	url = "Member/Login";
	ret = memberAjaxCallPost(url, JSONtoString(jsontext));

	if (ret.data.ResultData == "10") {// sns로그인 성공(연동된 통합계정으로 로그인됨)

		userInfo.masterId = ret.data.MemberLoginInfo[0].MCodeID;
		userInfo.userId = ret.data.MemberLoginInfo[0].UserID;
		userInfo.snsType = login_info["snsType"];
		userInfo.token = login_info['id'];
		userInfo.loginNM = ret.data.MemberLoginInfo[0].UserName;
		userInfo.articleViewAct = "Y";
		if (userInfo.loginNM == null)
			userInfo.loginNM = "";
		userInfo.nickNM = ret.data.MemberLoginInfo[0].UserNickName;
		$.cookie('userInfo', JSON.stringify(userInfo), {
			path : '/'
		});
		if (typeof userInfo.masterId != '') {
			$.cookie("MCodeID", userInfo.masterId, {
				path : "/",
				domain : ".edaily.co.kr"
			}); // --> 회원코드 쿠키생성.
		}
		$.removeCookie('snsInfo');

		// skmin
		// 로그인성공시 앱펑션 호출 (기존 myauthdone.js
		// 참조)////////////////////////////////////////////////
		// --> 로그인 완료 함수 호출.
		
		 * new_mem_mauth = $(get_data).find("MEM_MAUTH").text();
		 * 
		 * //--> 로그인 완료 함수 호출. var login_mode = "";
		 * if(popGlo_outSideAppInfo["app_gubun"] == undefined) { login_mode =
		 * ""; } else { if(popGlo_outSideAppInfo["app_gubun"] == "inMove") {
		 * login_mode = "inMove"; } else { login_mode = "outSide"; } }
		 * 
		 * if((popGlo_outSideAppInfo["app_gubun"] == undefined) ||
		 * (popGlo_outSideAppInfo["app_gubun"] == "inMove")) {
		 *  // mobile, pc 인 경우 if(navigator.userAgent.indexOf("edailyapp_") ==
		 * -1) {
		 * 
		 * login_done({ user_loginId : $.cookie("userInfoLoginId"), user_mcode :
		 * $.cookie("userInfoMcode"), user_gender : $.cookie("userInfoGender"),
		 * user_nick : $.cookie("userInfoNick"), user_mgroup :
		 * $.cookie("userInfoMgroup"), user_mauth : new_mem_mauth,
		 * user_mcodeauth : $.cookie("userInfoMcodeauth") }, login_mode); } //
		 * app 인 경우 else {
		 * 
		 * var todayDate = new Date(); var minutes = 10; todayDate.setTime(
		 * todayDate.getTime() + (minutes * 60 * 1000) );
		 * 
		 * $.cookie("userInfoMauth",new_mem_mauth, {path:"/",
		 * domain:".edaily.co.kr", expires:365}); //--> 회원권한 쿠키생성.
		 * 
		 * //--> 로그인 완료 함수 호출. accountLink_done({ user_loginId :
		 * $.cookie("userInfoLoginId"), user_mcode : $.cookie("userInfoMcode"),
		 * user_gender : $.cookie("userInfoGender"), user_nick :
		 * $.cookie("userInfoNick"), user_mgroup : $.cookie("userInfoMgroup"),
		 * user_mauth : new_mem_mauth, user_phone : "" });
		 *  // 안드로이드만... //if(navigator.userAgent.indexOf("Android") > -1) {
		 * loginAfterProcessor(login_mode); //} } } else {
		 * outSideDone_processor(); }
		 
		// 로그인성공시 앱펑션 호출 (기존 myauthdone.js
		// 참조)////////////////////////////////////////////////
		if (gubun == 'comment') {
			location.reload();
			replyAllClose('closeDiv', 'open');
		} else {
			var url = $.cookie('referrer');
			if ($.cookie('referrer') == undefined)
				url = "/index.html";
			$(location).attr('href', url);
		}
	} else {// sns최초 로그인

		var snsInfo = {};
		snsInfo['SNSDiv'] = login_info["snsType"];
		snsInfo['SNSKey'] = login_info["id"];

		$.cookie('snsInfo', JSON.stringify(snsInfo), {
			path : '/'
		});

		$.removeCookie('userInfo');
		userInfo.snsType = login_info["snsType"];
		userInfo.token = login_info["token"];
		userInfo.loginNM = login_info["name"];
		userInfo.snsId = login_info["id"];
		$.cookie('userInfo', JSON.stringify(userInfo), {
			path : '/'
		});

		if (gubun == 'comment') {
			location.reload();
		} else {
			var url = "/member/add_join.html?gubun=sns";
			$(location).attr('href', url);
		}
	}
}*/

