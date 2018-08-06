
script = document.createElement("script");
script.async = true;
script.src = "https://apis.google.com/js/client:plusone.js?onload=render";
scripttype = "text/javascript";
script.charset = "utf-8";
document.getElementsByTagName("head")[0].appendChild(script);
$("body").ready(function(){
	setTimeout(function(){
    //naver_id_login = new naver_id_login(snsKey.naver.key, snsKey.naver.callback);
    //snsKey.naver.state = naver_id_login.getUniqState();

    }, 100);


});

function render() { 
	gapi.signin.render('gplus', {
      'callback': 'signinCallback', 
      'clientid': '330617707249-bftgj523v59ka5ue3chr64mrueq4jo9g.apps.googleusercontent.com',
      'cookiepolicy': 'single_host_origin',
      'requestvisibleactions': 'http://schemas.google.com/AddActivity',
      'scope': 'https://www.googleapis.com/auth/plus.login'
  	});
  	//signinCallback();
}
var google_access_token = "";
function signinCallback(authResult) { 
if (authResult['access_token']) {
       google_access_token = authResult['access_token'];
       
       var idToken = authResult['id_token'];
       gapi.auth.setToken(authResult); 
       getEmail(); 
} else if (authResult['error']) {
    // ������ �߻��߽��ϴ�.
    // ������ ���� �ڵ�:
    //   "access_denied" - ����ڰ� �ۿ� ���� �׼��� �ź�
    //   "immediate_failed" - ����ڰ� �ڵ����� �α����� �� ����
    /*  alert('���� �߻�: ' + authResult['error']); */
  }
}
function getEmail(){
	// userinfo �޼ҵ带 ����� �� �ֵ��� oauth2 ���̺귯���� �ε��մϴ�.
	gapi.client.load('oauth2', 'v2', function() {
		var request = gapi.client.oauth2.userinfo.get();
		request.execute(getEmailCallback);
	});
}
function getEmailCallback(obj){// ������ ������  �Ѱܹ��� obj������  �����Ͽ� �̾Ƴ��� ��.
	var login_info = obj;
	login_info['snsType'] = "GOOGLE";
	login_info['token'] = google_access_token;
	login_info['nickname'] = obj.name;
	login_info['name'] = obj.name;
	login_info['id'] = obj.id;
	//colsole.log(login_info['snsType']);
	//colsole.log(login_info['token']);
	//colsole.log(login_info['nickname']);
	//colsole.log(login_info['name']);
	//colsole.log(login_info['id']);
	alert(login_info['snsType'] + "\n" +
			login_info['token'] + "\n" +
			login_info['nickname'] + "\n" +
			login_info['name'] + "\n" +
			login_info['id'] + "\n" );
	disconnectUser();// ���� �ٰ��������� �ڵ� ���� �α׾ƿ�
}
//���� �α׾ƿ� 
function disconnectUser() {
var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + google_access_token; // �α׾ƿ��� ���ؼ��� ��URL�� �׳� ��ū���� �߰��ؼ� �����ָ�ȴ�.
	// �񵿱� GET ��û�� �����մϴ�.
    $.ajax({
	    type: 'GET',
	    url: revokeUrl,
	    async: false,
	    contentType: "application/json",
	    dataType: 'jsonp',
	    success: function(nullResponse) { 
	    	// ����
	    },
	    error: function(e) {
		    // ���� ó��
		    // ������ ��� ����ڰ� �������� ���� �����ϰ� �� �� �ֽ��ϴ�.
		    // https://plus.google.com/apps
	    }
    });
}
