const fs = require('fs')
var jsonStr

fs.readFile('word_data/sanalista.xml', 'utf8' , (err, data) => {
	if (err) {
		console.error(err)
		return
	}

	var arr = data.split('<s>').join('</s>').split('</s>').filter(word => word.length == 5).filter(word => word.match(/^[a-zöä]+$/))

	arr.forEach(element => {
		//console.log(element)
	})

	jsonStr = JSON.stringify(arr)

	fs.writeFile('src/words.json', jsonStr, 'utf8', function(error) { 
		if (error) throw error
		console.log('file saved')
	})
})