// New vuejs instance
new Vue({
	// CSS selector of the root DOM element
	el: '#notebook',

	// Some data
	data() {
		return {
			content: localStorage.getItem('content') || 'You can write in **markdown**',
			// content: 'This is a note',
			notes: [],
		}
	},

	// Computed properties
	computed: {
		notePreview () {
			return marked(this.content)
		},
		addButtonTitle () {
			return notes.length + ' note(s) already'
		}
	},

	// Change watches
	watch: {
		// Watching 'content' data property
		content: {
			handler (val, oldVal) {
				console.log('new note: ', val, 'old note: ', oldVal)
				console.log('saving note: ', this.content)
				localStorage.setItem('content', this.content)
			},
			immediate: true
		},
	},

	// 
	methods: {
		// Add a note with some default content and select it
		addNote () {
			const time = Date.now()
			// Default new note
			const note = {
				id: String(time),
				title: 'New note ' + (this.notes.length + 1),
				content: '**Hi!** This notebook is using [markdown] (https://github.com/adamj-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
				created: time,
				favorite: false
			}
			// Add to the list
			this.notes.push(note)
		},
		saveNote () {
			console.log('saving note: ', this.content)
			localStorage.setItem('content', this.content)
			this.reportOperation('saving')
		},
		reportOperation (opName) {
			console.log('The', opName, 'operation was completed!')
		}
	},

	// This will be called when the instance is ready
	created () {
		// Set the content to the stored value
		// or to a default string if nothing was saved
		this.content = localStorage.getItem('content') || 'You can write in **markdown**'
	},
})
