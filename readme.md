# ![Assessment 3][banner]

In this repository I show the education level through out the years 2003 to 20013. This first pie chart shows the total per year and the second graph shows per education levele.

### The Data

The data I used for this was from [the CBS]. Part of the recommended data. The data is used for this was the [education level population].

This is the cleaned data I use for the first chart

```javascript
[
	{ year: "2003", total: 36531 },
	{ year: "2003", total: 36531 },
	{ year: "2003", total: 36531 },
	...
]
```

This is the cleaned data I use for the second chart
```javascript
{
	2003: [
		[
			{ i: 1, type: "primary", key: "all", value: 1216 },
			{ i: 2, type: "vmbo, mbo1, avo", key: "all", value: 1544 },
			{ i: 3, type: "havo, vwo, mbo", key: "all", value: 873 },
			...
		],
		[ ... ], // Man
		[ ... ] // Woman
	],
	2004: [
		[
			{ i: 1, type: "primary", key: "all", value: 1216 },
			{ i: 2, type: "vmbo, mbo1, avo", key: "all", value: 1544 },
			{ i: 3, type: "havo, vwo, mbo", key: "all", value: 873 },
			...
		],
		[ ... ], // Man
		[ ... ] // Woman
	]
}
```

### Interaction

The chart on the left shows the total per year while the chart in the left shows the detailed data of the selected year. So when clicking on an other year in the left chart the chart on the right will update with the data of that year.

When you click on a new year the function `updateSchoolForces` is called which will start the updating for the data and also handles the transitions.

After setting the new data like so
```javascript
serie = niveauSvg.selectAll( '.serie' )
	.data( series )
```

Removing anything unnecessary
```javascript
serie.exit().remove()
```

We can update anything that needs updating
```javascript
serie.enter().append( '.serie' )
	.attr( 'transform', `translate( -${ margin }, ${ margin / 2 } )` )
```

Update (with transition) the paths
```javascript
serie.select( 'path' )

	.transition()
	.duration( 500 )
	.style( 'stroke', d => zSchool( d[ 0 ].key ) )
	.attr( 'd', d3.line()
		.x( d => x( d.i ) )
		.y( d => y( d.value ) ) )
```

And updating the labels value and position
```javascript
const label = serie
	.selectAll( '.label' )
	.data( d => d )

label.transition()
	.duration( 500 )
	.attr( 'transform', ( d, i ) => `translate( ${ x( d.i ) }, ${ y( d.value ) } )` )

label.select( 'text' )
	.text( d => d.value )
```

### Resources

- To help with the [pie chart].
- This helpt me greatly with understanding [data joins].
- And this was a great example for data joins [in action].

[banner]: https://cdn.rawgit.com/cmda-fe3/logo/a4b0614/banner-assessment-3.svg

[a2]: https://github.com/cmda-fe3/course-17-18/tree/master/assessment-3#description

[fe3]: https://github.com/cmda-fe3

[cmda]: https://github.com/cmda

[pages]: https://pages.github.com

[the CBS]: http://cbs.nl/

[education level population]: http://statline.cbs.nl/statweb/publication/?vw=t&dm=slen&pa=71882eng&d1=0-1&d2=a&d3=10-15&d4=(l-10)-l&hd=151216-1430&la=en&hdr=g3&stb=g1,t,g2

[pie chart]: http://bl.ocks.org/bbest/2de0e25d4840c68f2db1

[data joins]: https://bost.ocks.org/mike/join/

[in action]: http://bl.ocks.org/alansmithy/e984477a741bc56db5a5
