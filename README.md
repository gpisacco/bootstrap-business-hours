Bootstrap Bussiness Hours
===========

Bootstrap Bussiness Hours is a small library to display a business hours widget into an application. Allowing you to chose the opening and closing hour for every day of the week.
The values are taken from local timezone and translated to utc iso date to submit it to the server

## Usage

### Instantiation

```html
          <div class="form-group" id="bh">
		  </div>
```

How to initialize the widget:
 
```js
	this.$('#bh').bussinesshours({
		lang:'EN',
		selectClass:'no-update',
		optionClass:'no-update',
		checkboxClass:'no-update',
		data:{
        "1" : [ 
            {
                "to" : 1,
                "from" : 0
            }
        ],
        "0" : [ 
            {
                "to" : 2359,
                "from" : 0
            }
        ],
        "3" : [ 
            {
                "to" : 2359,
                "from" : 0
            }
        ],
        "2" : [ 
            {
                "to" : 2359,
                "from" : 0
            }
        ],
        "5" : [ 
            {
                "to" : 2359,
                "from" : 0
            }
        ],
        "4" : [ 
            {
                "to" : 2359,
                "from" : 0
            }
        ],
        "6" : [ 
            {
                "to" : 2359,
                "from" : 0
            }
        ]
    }
	});
```

How to get value:

```js
	var bh=this.$('#bh').bussinesshours('value');
	consle.log(bh);
```



## History

### v0.0.1: March 2, 2014
* Initial Deployment
