// Resource gebruikt binnen setYears: http://bl.ocks.org/bbest/2de0e25d4840c68f2db1

const margin = 25,
	height = window.innerHeight - 50,
	width = ( window.innerWidth - 300 ) / 2, // Ik wil er 2 naast elkaar
	radius = ( width / 2 ) - ( margin * 2 ), // Ik gebruik de width op x en y zodat dit beter in verhouding blijft.
    innerRadius = 0.15 * radius,
	color = d3.scaleLinear()
	    .range( [ '#6edf11', '#004fe0' ] ),

	yearSvg = d3.select( 'body' )// Zet de linker svg
		.append( 'svg' )
		.attr( 'class', 'year-svg' )
		.attr( 'height', width )
		.attr( 'width', width ),

	yearG = yearSvg.append( 'g' )
    	.attr( 'transform', `translate( ${ width / 2 }, ${ width / 2 } )` )

	niveauSvg = d3.select( 'body' ) // Zet de rechter svg
		.append( 'svg' )
		.attr( 'class', 'niveau-svg' )
		.attr( 'height', width + 100 )
		.attr( 'width', width )
		.attr( 'transform', `translate( 0, ${ margin / 2 } )`),

	x = d3.scaleLinear(),
	y = d3.scaleLinear(),

	years = [],
	school = {},

	xSchool = d3.scaleLinear(),

	ySchool = d3.scaleLinear(),

	zSchool = d3.scaleOrdinal( d3.schemeCategory10 ),

	edu = [ 'primary', 'vmbo, mbo1, avo', 'havo, vwo, mbo', 'hbo', 'wo', 'unknown' ] // Alle opleidings opties

let firstYear

d3.text( 'labour_force.csv', loadText )

function loadText( err, text ) {

	if ( err ) console.log( err )

	console.log( text )

	const noHeader = text.substring( text.lastIndexOf( '"x 1 000"' ) + 11, text.length ), // Verwijder de header
		noFooter = noHeader.substring( 0, noHeader.indexOf( '�' ) - 1 ), // Verwijder de footer
		data = d3.csvParseRows( noFooter ) // Van text naar csv

	console.log( noFooter )
	console.log( data )

	data.forEach( el => {

		let ell = el

		if ( el.length === 1 ) {

			ell = el[ 0 ].split( ';' )

			const newShit = ell.map( a => {

				console.log( a )

				return a.replace( '"', '' )

			})

			console.log( ell )
			console.log( newShite )

		}

		// ell[ 0 ] = ell[ 0 ].replace( '"', '' )

		if ( !school[ ell[0] ] ) school[ ell[0] ] = [] // bestaat school[ ell[0] ] nog niet? Maak hem aan

		const curr = school[ ell[0] ]
		curr.push( [
				{ i: 1, type: 'primary', key: 'all', value: Number( ell[ 1 ] ) },
				{ i: 2, type: 'vmbo, mbo1, avo', key: 'all', value: Number( ell[ 3 ] ) },
				{ i: 3, type: 'havo, vwo, mbo', key: 'all', value: Number( ell[ 5 ] ) },
				{ i: 4, type: 'hbo', key: 'all', value: Number( ell[ 7 ] ) },
				{ i: 5, type: 'wo', key: 'all', value: Number( ell[ 9 ] ) },
				{ i: 6, type: 'unknown', key: 'all', value: Number( ell[ 11 ] ) }
			], [
				{ i: 1, type: 'primary', key: 'men', value: Number( ell[ 1 + 13 ] ) },
				{ i: 2, type: 'vmbo, mbo1, avo', key: 'men', value: Number( ell[ 3 + 13 ] ) },
				{ i: 3, type: 'havo, vwo, mbo', key: 'men', value: Number( ell[ 5 + 13 ] ) },
				{ i: 4, type: 'hbo', key: 'men', value: Number( ell[ 7 + 13 ] ) },
				{ i: 5, type: 'wo', key: 'men', value: Number( ell[ 9 + 13 ] ) },
				{ i: 6, type: 'unknown', key: 'men', value: Number( ell[ 11 + 13 ] ) }
			], [
				{ i: 1, type: 'primary', key: 'woman', value: Number( ell[ 1 + 25 ] ) },
				{ i: 2, type: 'vmbo, mbo1, avo', key: 'woman', value: Number( ell[ 3 + 25 ] ) },
				{ i: 3, type: 'havo, vwo, mbo', key: 'woman', value: Number( ell[ 5 + 25 ] ) },
				{ i: 4, type: 'hbo', key: 'woman', value: Number( ell[ 7 + 25 ] ) },
				{ i: 5, type: 'wo', key: 'woman', value: Number( ell[ 9 + 25 ] ) },
				{ i: 6, type: 'unknown', key: 'woman', value: Number( ell[ 11 + 25 ] ) }
			]
		) // Sorteer alles en push dit

	})

	console.log( data )

	// Zet de data voor de jaar piechart
	data.forEach( ( el, i ) => {

		let ell = el

		if ( el.length === 1 ) ell = el[ 0 ].split( ';' )

		firstYear = ell[ 0 ]

		firstYear = firstYear.replace( '"', '' )

		const noYear = ell.shift() // Verwijder eerst in de arr. Is year.

		const total = ell.reduce( ( old, neew ) => {

			const neeew = neew.replace( '"', '' )
			return Number( old ) + parseInt( neeew )

		}, 0) // Geef mij het totaal aantal

		years.push( { year: noYear, total } )

	})

	setYears( years )
	setEducation( school, firstYear )

	console.log( years )
	console.log( school )

}


function setYears( year ) {

	const allValues = year.map( el => el.total ),
		min = d3.min( allValues ), // Eerste jaar
		max = d3.max( allValues ), // Laatste jaar

		valueScale = d3.scaleLinear()
			.domain( [ min, max ] )
		    .range( [ 80, 100 ] ),

		data = year.map( el => {
			return {
				width: 1,
				weight: 1,
				score: valueScale( el.total ),
				year: el.year
			}
		}),

		pie = d3.pie()
			.sort( null )
			.value( d => d.width ), // D3 pie functie

		arc = d3.arc()
			.innerRadius( innerRadius )
			.outerRadius( d => ( ( radius - innerRadius ) * ( d.data.score / 100.0 ) + innerRadius ) ),

		path = yearG.selectAll( '.solidArc' )
			.data( pie( data ) )
			.enter()
			.append( 'path' )
			.attr( 'fill', () => color( Math.random() ) ) // Random kleur
			.attr( 'class', ( d, i ) => i === data.length - 1 ? 'active' : '' ) // Laatste element krijg de class active
			.classed( 'solidArc', true )
			.attr( 'stroke', 'gray' )
			.attr( 'd', arc )
			.on( 'click', function() {

				yearG.select( '.active' )
					.classed( 'active', false ) // Verwijder de class active

				d3.select( this ).classed( 'active', true ) // Zet de class active

				updateSchoolForces(
					school,
					d3.select( this )
						.select( 'title' )
						.text()
						.substring( 0, 4 ) // Pak hier alleen het jaar
				) // Update de andere chart met nieuwe data

			})


	path.append( 'title' )
		.text( ( d, i ) => `${ d.data.year }: ${ year[ i ].total / 1000 }.000 mensen` )

	path.append( 'text' )
		.text( d => d.data.year )

	yearSvg.append( 'text' )
		.classed( 'year-title', true )
		.attr( 'transform', `translate( ${ margin }, ${ margin } )` )
		.text( `Education level ${ year[ year.length - 1 ].year } (2003 - 2013)` )

}


function setEducation( school, year ) {

	const series = school[ year ]

	const x = xSchool.domain( [ 0, 5 ] )
			.range( [ 0, width - ( margin * 2 ) ] ),

		y = ySchool.domain( [
				0,
				Math.ceil( d3.max( series, s => d3.max(s, d => d.value ) ) / 1000 ) * 1000 // Stel je hebt 4500, maak hier 4.5 van. Rond af naar boven en * 1000
			] )
			.range( [ width - ( margin * 2 ), 0 ] )

	niveauSvg.append( 'g' )
		.attr( 'class', 'axis axis--x' )
		.attr( 'transform', `translate( ${ margin }, ${ width - margin } )` )
		.call( d3.axisBottom( x )
			.ticks( 6 ) // Hoeveel items er op de as staan
			.tickFormat( d => edu[ d ] ) // Text die er in komt te staan
			.tickValues( [ 0, 1, 2, 3, 4, 5, 6 ] ) ) // Welke valie er aan gekoppelt is

  const serie = niveauSvg.selectAll( '.serie' )
	    .data( series )
	    .enter()
		.append( 'g' )
	    .attr( 'class', 'serie' )
		.attr( 'transform', `translate( -${ margin * 2 + 20 }, ${ margin / 2 } )` )

	serie.append( 'path' )
		.attr( 'class', 'line' )
		.style( 'stroke', d => zSchool( d[ 0 ].key ) )
		.attr( 'd', d3.line()
			.x( d =>  x( d.i ) )
			.y( d => y( d.value ) ) )

	const label = serie
		.selectAll( '.label' )
		.data( d => d )
		.enter()
		.append( 'g' )
		.attr( 'class', 'label' )
		.attr( 'transform', ( d, i ) => `translate( ${ x( d.i ) }, ${ y( d.value ) } )` )


	label.append( 'rect' )
		.attr( 'width', 30 )
		.attr( 'height', 10 )
		.attr( 'x', - ( 30 / 2 ) )
		.attr( 'y', - 5 )
		.attr( 'fill', '#fff' )

	label.append( 'text' )
		.attr( 'dy', '.35em' )
		.text( d => d.value )


	const legend = serie.append( 'g' )
			.classed( 'legend', true )
			.attr( 'transform', `translate( ${ width - 40 - margin }, 0 )` )
			.selectAll( '.item' )
			.data( series )
			.enter()
			.append( 'g' )
			.classed( 'item', true )
			.attr( 'transform', ( d, i ) => `translate( 0, ${ i * 15 } )` )

	legend.append( 'line' )
		.attr( 'x0', 0 )
		.attr( 'y0', 0 )
		.attr( 'x1', 30 )
		.attr( 'y1', 0 )
		.attr( 'stroke', d => zSchool( d[ 0 ].key ) )
		.attr( 'stroke-width', 3 )

	legend.append( 'text' )
		.attr( 'x', -5 )
		.attr( 'y', 2 )
		.style( 'text-anchor', 'end' )
		.text( ( d, i ) => d[ i ].key )

	const text = niveauSvg.selectAll( '.tick' )
		.select( 'text' )

	// Zorg dat de value van de x as geroteerd is en goed staat
	text.attr( 'transform', `rotate( 90 ) translate( ${ text.node().getBBox().width + 20 }, -15 )` )

	niveauSvg.append( 'text' )
		.classed( 'year-title', true )
		.attr( 'transform', `translate( ${ margin }, ${ margin } )` )
		.text( 'x 1000' ) // Zet er ook even bij dat dit alles X 1000 is

}

function updateSchoolForces( school, year ) {

	// Nu nog update
	yearSvg.select( '.year-title' )
		.text( `Education level ${ year } (2003 - 2013)` )

	// Pak de huidige data die nodig is.
	const series = school[ year ],

		x = xSchool.domain( [ 0, 5 ] )
				.range( [ 0, width - ( margin * 2 ) ] ),

		y = ySchool.domain( [
				0,
				Math.ceil( d3.max( series, s => {
					console.log( series )
					console.log( s )
					return d3.max(s, d => {
						console.log( d )
						return d.value
					} )
				} ) / 1000 ) * 1000
			] )
			.range( [ width - ( margin * 2 ), 0 ] ),

		// Nieuwe data er in
		serie = niveauSvg.selectAll( '.serie' )
	  	    .data( series )

	// Overige dingen verwijderen
	serie.exit().remove()

	// En als er nieuwe elementen zijn deze inladen
	serie.enter().append( '.serie' )
		.attr( 'transform', `translate( -${ margin }, ${ margin / 2 } )` )


	// Update (met transition) de path(lijn)
	serie.select( 'path' )

		.transition()
		.duration( 500 )
		.style( 'stroke', d => zSchool( d[ 0 ].key ) )
		.attr( 'd', d3.line()
			.x( d => x( d.i ) )
			.y( d => y( d.value ) ) )

	const label = serie
		.selectAll( '.label' )
		.data( d => d )


	// En ook de positie van de label aanpassen
	label.transition()
		.duration( 500 )
		.attr( 'transform', ( d, i ) => `translate( ${ x( d.i ) }, ${ y( d.value ) } )` )

	label.select( 'text' )
		.text( d => d.value )


}
