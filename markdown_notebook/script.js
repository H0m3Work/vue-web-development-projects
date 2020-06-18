Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'))

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
			selectedId: localStorage.getItem('selected-id') || null,
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
		},
		sortedNotes () {
			return this.notes.slice()
				.sort((a, b) => a.created - b.created)
				.sort((a, b) => (a.favorite === b.favorite) ? 0 
					: a.favorite ? -1 : 1)
		},
		linesCount () {
			if (this.selectedNote) {
				// Count the number of new line characters
				return this.selectedNote.content.split(/\r\n|\r|\n/).length
			}
		},
		wordsCount () {
			if (this.selectedNote) {
				var s = this.selectedNote.content
				// Turn new line characters into white-spaces
				s = s.replace(/\n/g, ' ')
				// Exclude start and end white-spaces
				s = s.replace(/(^\s*)|(\s*$)/gi, '')
				// Turn 2 or more duplicate white-spaces into 1
				s = s.replace(/\s\s+/gi, ' ')
				// Return the number of spaces
				return s.split(' ').length
			}
		},
		charactersCount () {
			if (this.selectedNote) {
				return this.selectedNote.content.split('').length
			}
		}
	},

	// Change watches
	watch: {
		notes: {
			// The method name
			handler: 'saveNote',
			// We need this to watch each note's properties inside the array
			deep: true,
		},
		// Let's save the selection too
		selectedId (val) {
			localStorage.setItem('selected-id', val)
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
		},
		removeNote () {
			if (this.selectedNote && confirm('Delete the note?')) {
				// Remove the note in the notes array
				const index = this.notes.indexOf(this.selectedNote)
				if (index !== -1) {
					this.notes.splice(index, 1)
				}
			}
		},
		favoriteNote () {
			this.selectedNote.favorite ^= true
		}

	},

	// This will be called when the instance is ready
	created () {
		// Set the content to the stored value
		// or to a default string if nothing was saved
		this.content = localStorage.getItem('content') || 'You can write in **markdown**'
	},
})
