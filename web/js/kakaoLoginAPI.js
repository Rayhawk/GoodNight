
<script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>

<script type='text/javascript'>
	function kakaoLogin() {
		//alert('카카오');
		Kakao.cleanup();
		Kakao.init("1ff3cda559279da48d175e454b58344c");
		Kakao.Auth.login({
			success : function(authObj) {
				var login_info = {};
				login_info["snsType"] = "KAKAO";
				login_info["token"] = authObj.access_token;
				Kakao.API.request({
					url : '/v1/user/me',
					success : function(res) {
						login_info[""]
						login_info["id"] = res.id;
						login_info["email"] = res.kaccount_email;
						login_info["name"] = res.properties.nickname;
						login_info["nickname"] = res.properties.nickname;
						console.log(login_info["snsType"]);
						console.log(login_info["token"]);
						console.log(login_info["id"]);
						console.log(login_info["email"]);
						console.log(login_info["name"]);
						console.log(login_info["nickname"]);
					},
					fail : function(error) {
						alert('카카오톡 로그인 실패');
					}
				});
			},
			fail : function(err) {
				alert('카카오톡 로그인 실패');
			}
		});
	}
</script>