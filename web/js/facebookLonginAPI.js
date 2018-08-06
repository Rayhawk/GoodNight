
	// This is called with the results from from FB.getLoginStatus().
	function statusChangeCallback(response) {
		console.log('statusChangeCallback');
		console.log(response);
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			testAPI();
		} else {
			// The person is not logged into your app or we are unable to tell.
			document.getElementById('status').innerHTML = 'Please log '
					+ 'into this app.';
		}
	}

	// This function is called when someone finishes with the Login
	// Button.  See the onlogin handler attached to it in the sample
	// code below.
	function checkLoginState() {
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	}

	window.fbAsyncInit = function() {
		FB.init({
			appId : '660791344270515',
			xfbml : true,
			version : 'v3.0'
		});
		FB.AppEvents.logPageView();
	};
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id))
			return;
		js = d.createElement(s);
		js.id = id;
		js.src = 'https://connect.facebook.net/ko_KR/sdk.js#xfbml=1&version=v3.0';
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	// Here we run a very simple test of the Graph API after login is
	// successful.  See statusChangeCallback() for when this call is made.
	function fb_login() {
		//alert('페이스북');
		FB.login(function(response) {
			var login_info = {};
			login_info["snsType"] = "FACEBOOK";
			login_info["token"] = response.authResponse["accessToken"];
			if (response.status === 'connected') {
				// Logged into your app and Facebook.
				login_info["id"] = response.authResponse["userID"];
				FB.api('/me', function(response) {
					login_info["name"] = response.name;
					login_info['nickname'] = response.name;
					console.log(login_info["snsType"]);
					console.log(login_info["token"]);
					console.log(login_info["id"]);
					console.log(login_info["email"]);
					console.log(login_info["name"]);
					console.log(login_info["nickname"]);
				});
			} else {
				'into this app.';
			}
		}, {
			scope : 'public_profile,email'
		});

	}
