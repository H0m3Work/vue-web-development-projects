// New vuejs instance
new Vue({
	// CSS selector of the root DOM element
	el: '#notebook',

	// Some data
	data() {
		return {
			content: localStorage.getItem('content') || 'You can write in **markdown**',
			// content: 'This is a note',
			notes: JSON.parse(localStorage.getItem('notes')) || [],
			// Id of the selected note
			selectedId: null,
		}
	},

	// Computed properties
	computed: {
		notePreview () {
			return this.selectedNote ? marked(this.selectedNote.content) : ''
		},
		addButtonTitle () {
			return this.notes.length + ' note(s) already'
		},
		selectedNote () {
			// We return the matching note with selectedId
			return this.notes.find(note => note.id === this.selectedId)
		}
	},

	// Change watches
	watch: {
		notes: {
			// The method name
			handler: 'saveNote',
			// We need this to watch each note's properties inside the array
			deep: true,
		}
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
			// Don't forget to stringify to JSON before storing
			localStorage.setItem('notes', JSON.stringify(this.notes))
			console.log('Notes saved!', new Date())
		},
		reportOperation (opName) {
			console.log('The', opName, 'operation was completed!')
		},
		selectNote (note) {
			this.selectedId = note.id
			console.log(this.selectedId)
		}
	},

	// This will be called when the instance is ready
	created () {
		// Set the content to the stored value
		// or to a default string if nothing was saved
		this.content = localStorage.getItem('content') || 'You can write in **markdown**'
	},
})
