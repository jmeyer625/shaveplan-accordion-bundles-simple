$(document).on('ready', function(){
	var eventClick = jQuery.Event('click');
	var plans = {
		'everyday' : {
			'image' : 'images/faces/everyday.png',
			'text' : 'Everyday Shaver - Ships every 2 months',
			months : 2
		},
		'occasional' : {
			'image' : 'images/faces/occasional.png',
			'text' : 'Occasional Shaver - Ships every 3 months',
			months : 3
		},
		'infrequent' : {
			'image' : 'images/faces/infrequent.png',
			'text' : 'Infrequent Shaver - Ships every 5 months',
			months : 5
		}
	}

	var cart = {
		"blade-only" : {	
			slug: "blade-only",
			title: "Blade Only Plan",
			isRecurring: true,
			months: 2,
			exists:true,
			frequency: "Every 2 months",
			image: "images/cart/Blades-Group-2.jpg",
			price: 15,
			includes: ["1 x 8-pack Harry's Blades"],
			savings: 0,
			'dollar-price': '$15.00'
		},
		"essential" : {
			slug: "essential",
			title: "Essential Shave Plan",
			isRecurring: true,
			months: 2,
			exists:false,
			frequency: "Every 2 months",
			image: "images/cart/2x2-Redemption-Gel.jpg",
			price: 30,
			includes: ["1 x 8-pack Harry's Blades", "2 x Foaming Shave Gels"],
			savings: 9,
			'dollar-price': '$30.00'
		},
		"sensitive-skin" : {
			slug : "sensitive-skin",
			title : "Sensitive Skin Shave Plan",
			isRecurring: true,
			months: 2,
			exists: false,
			frequency: "Every 2 months",
			image: "images/cart/Blades-Gel-and-AfterShave-3.jpg",
			price: 40,
			includes: ["1 x 8-pack Harry's Blades", "2 x Foaming Shave Gels", "1 x After Shave Moisturizer"],
			savings: 9,
			'dollar-price': '$40.00'
		},
		'truman' : {
			slug: "truman",
			title: "Truman Handle",
			variant: "Color",
			options : [
				{name:'Total Orange',price:10, discount:10,selected:true,"cart-image": 'images/cart/truman-handle-total-orange.jpg'},
				{name:'Nautilus Blue',price:10, discount:10,selected:false,"cart-image": 'images/cart/truman-handle-nautilus-blue.jpg'},
				{name:'Olive 107',price:10, discount:10,selected:false,"cart-image": 'images/cart/truman-handle-olive-107.jpg'},
				{name:'Ivory',price:10, discount:10,selected:false,"cart-image": 'images/cart/truman-handle-ivory.jpg'}
			],
			quantities: [
				{amount:0, selected:false},
				{amount:1, selected:true},
				{amount:2, selected:false},
				{amount:3, selected:false},
				{amount:4, selected:false}
			],
			isRecurring: false,
			months: 2,
			exists:true,
			frequency: "Every 2 months"
		}
	};

	trumanImages = {
		'truman-blue' : "images/cart/truman-handle-nautilus-blue.jpg",
		'truman-orange' : "images/cart/truman-handle-total-orange.jpg",
		'truman-olive' :"images/cart/truman-handle-olive-107.jpg",
		'truman-ivory':"images/cart/truman-handle-ivory.jpg"
	}

	trumanTitles = {
		'truman-blue' : "Nautilus Blue",
		'truman-orange' : "Total Orange",
		'truman-olive' :"Olive 107",
		'truman-ivory':"Ivory"
	}

	var makeDollars = function(num) {
		
		if(num) {
			return '$' + num.toFixed(2);
		} else {
			return '$0.00'
		}
		
	}

	var renderPlanSummary = function(planObject){
		var source = $('#shaverSummaryTemplate').html();
		var template = Handlebars.compile(source);
		return template(planObject)
	}

	var renderTextSummary = function(textObject) {
		var source = $('#textSummaryTemplate').html();
		var template = Handlebars.compile(source);
		return template(textObject)
	}

	var renderBundleSummary = function(bundle) {
		var source = $('#bundleSummaryTemplate').html();
		var template = Handlebars.compile(source);
		return template(bundle);
	}

	var renderHandleSummary = function(handleObject) {
		var source = $('#handleSummaryTemplate').html();
		var template = Handlebars.compile(source);
		return template(handleObject)
	}

	var renderZeroSummary = function() {
		var source = $('#zeroSummaryTemplate').html();
		var template = Handlebars.compile(source);
		return template
	}

	var updateBundles = function() {
		var bundle = $('.bundle-selected').attr('data-bundle');
		var plan = $('.accordion-section[data-section="1"]').find('.plan-summary').attr('data-plan');
		for (var key in cart) {
			cart[key]['months'] = plans[plan]['months']
			if (cart[key].isRecurring) {
				cart[key].exists = false
			}
		}
		cart[bundle].exists = true
		var newEl = renderBundleSummary(cart[bundle]);
		$('.accordion-section[data-section="2"]').find('.section-summary').removeClass('summary-inactive').empty().append(newEl);
		newEl = renderPlanSummary(plans[plan]);
		$('.accordion-section[data-section="1"]').find('.section-summary').empty().append(newEl).removeClass('summary-inactive');
		$('.accordion-section[data-section="1"]').find('.plan-summary').attr('data-plan', plan);
	}

	var getOrderData = function(){
		updateBundles();
		var data = {'bundle': null, 'handle':{}}
		for (var key in cart) {
			if (cart[key].isRecurring && cart[key].exists) {
				data['bundle'] = cart[key];
			}
		}
		data['handle']['image'] = $('.handle-selected').find('img').attr('src');
		data['handle']['title'] = $('.handle-selected').find('.handle-title').text();
		return data

	}

	var updateOrderSummary = function(data, plans) {
		$('#handleCart').attr('src',data['handle']['image']);
		$('#handleTitle').text(data['handle']['title']);
		$('#bundleImage').attr('src', data['bundle']['image']);
		$('#summaryBundleTitle').text(data['bundle']['title']);
		$('#summaryBundlePrice').text(data['bundle']['dollar-price']);

		$('#recurringBundleImage').attr('src', data['bundle']['image']);
		$('#recurringBundleTitle').text(data['bundle']['title']);
		$('#recurringBundlePrice').text(data['bundle']['dollar-price']);

		$('#months').text(data['bundle']['months']);
		$('#monthsSummary').text(data['bundle']['months']);
		$('#oneTimeTotal').text(data['bundle']['dollar-price']);
		$('#monthlyTotal').text(makeDollars(data['bundle']['price']/data['bundle']['months'])+' / month')
		$('#recurringTotal').text(data['bundle']['dollar-price'])
		$('#subTotal').text(makeDollars(data['bundle']['price']));

	}

	var currentSection = 1;

	$(document).on('click', '.button', function(e){
		e.preventDefault();
		$(this).closest('.accordion-section-body').slideUp(100, function(){
			$(this).closest('.accordion-section-body').removeClass('active-section').addClass('inactive-section').removeAttr('style');
		});
		var nextSection = $(this).closest('.accordion-section-body').closest('.accordion-section').next()
		nextSection.find('.accordion-section-body').removeClass('inactive-section').slideDown(100, function(){
			nextSection.find('.accordion-section-body').addClass('active-section');
			nextSection.find('.accordion-title').addClass('active-title')
		});
		currentSection += 1;
	});

	$(document).on('click', '.accordion-title', function(e){
		e.preventDefault();
		if ($(this).hasClass('active-title')) {
			currentSection = $('.accordion-section[data-section="'+currentSection+'"]');
			currentSection.find('.accordion-section-body').removeClass('active-section').addClass('inactive-section');
			$(this).next().removeClass('inactive-section').addClass('active-section');
			currentSection = parseInt($(this).closest('.accordion-section').attr('data-section'));
			var handleColor = $('.handle-selected').find('.color-selector').css('background-color');
			var handleName = $('.handle-selected').find('.handle-title').text();
			var handleObject = {'text': 'Truman - ' + handleName, 'color': handleColor}
			var newEl = renderHandleSummary(handleObject);
			$('.accordion-section[data-section="3"').find('.section-summary').removeClass('summary-inactive').empty().append(newEl);

			data = getOrderData();
			updateOrderSummary(data,plans);
		}
		
		
	});

	$(document).on('click', '.handle-div', function(e){
		if (!$(this).hasClass('handle-selected')){
			$('.handle-div').removeClass('handle-selected');
			$(this).addClass('handle-selected');
		}
	});

	$(document).on('click', '.bundle-col', function(e){
		if (!$(this).hasClass('bundle-selected')){
			$('.bundle-col').removeClass('bundle-selected');
			$(this).addClass('bundle-selected');
		}
	});

	$(document).on('click', '.enroll', function(e){
		e.preventDefault();
		var planKey = $(this).attr('data-plan')
		var plan = plans[planKey];
		var newEl = renderPlanSummary(plan);
		$('.accordion-section[data-section="1"]').find('.section-summary').empty().append(newEl).removeClass('summary-inactive');
		$('.accordion-section[data-section="1"]').find('.plan-summary').attr('data-plan', planKey)
		data = getOrderData()
		updateOrderSummary(data,plans)
	});

	$(document).on('click', '#bundleComplete', function(e){
		var plan = $(this).closest('.accordion-section-body').find('.bundle-selected').attr('data-bundle');
		var newEl = renderBundleSummary(cart[plan]);
		$(this).closest('.accordion-section').find('.section-summary').removeClass('summary-inactive').empty().append(newEl);
		data = getOrderData()
		updateOrderSummary(data,plans)
	});

	$(document).on('click', '#handleComplete', function(e){
		var handleColor = $('.handle-selected').find('.color-selector').css('background-color');
		var handleName = $('.handle-selected').find('.handle-title').text();
		var handleObject = {'text': 'Truman - ' + handleName, 'color': handleColor}
		var newEl = renderHandleSummary(handleObject);
		$(this).closest('.accordion-section').find('.section-summary').removeClass('summary-inactive').empty().append(newEl);
		data = getOrderData()
		updateOrderSummary(data,plans)
	});


	$(document).on('click', '.choose-bundle', function(e){
		e.preventDefault();
		var bundle = $(this).prev().attr('data-bundle');
		$('.bundle-col').removeClass('bundle-selected');
		$('.bundle-col[data-bundle="'+bundle+'"]').addClass('bundle-selected');
		var newEl = renderBundleSummary(cart[bundle]);
		data = getOrderData();
		updateOrderSummary(data,plans);
		$(this).closest('.bundle-choice').css({'display':'none'});
		
		
		//$('.accordion-section[data-section="2"]').find('.section-summary').empty().append(newEl).removeClass('summary-inactive');
		
		$('.accordion-section[data-section="2"').find('.next-button').find('a').trigger(eventClick);
		
		

	});

	$(document).on('click', '.init-enroll', function(e){
		e.preventDefault();
		$(this).closest('.face-landing').css('display','none');
		$('.bundle-choice').css('display','block');
		var planKey = $(this).attr('data-plan')

		var plan = plans[planKey];
		var newEl = renderPlanSummary(plan);
		$('.accordion-section[data-section="1"]').find('.section-summary').empty().append(newEl).removeClass('summary-inactive');
		$('.accordion-section[data-section="1"]').find('.accordion-section-body').removeClass('active-section').addClass('inactive-section');
		$('.accordion-section[data-section="1"]').find('.plan-summary').attr('data-plan', planKey);
		$('.accordion-section[data-section="2"').find('.accordion-title').addClass('active-title');
		$('.accordion-section[data-section="2"').find('.accordion-section-body').removeClass('inactive-section').addClass('active-section');
		$('.accordion').css({'display':'block'});
		$(window).scrollTop(65);
		currentSection = 2;
		
		

	})

});