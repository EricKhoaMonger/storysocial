const moment = require('moment')

module.exports = {
    truncate: (str, length) => {
        if (str.length > length && str.length > 0) {
            let new_str = str + " "
            new_str = str.substr(0, length)
            new_str.substr(0, new_str.lastIndexOf(" "))
            new_str = (new_str.length > 0 ? new_str : str.substr(0, length))
            return new_str + '...'
        }
        return str
    },
    stripTags: (input) => {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    formatDate: (date, format) => {
        return moment(date).format(format)
    },
    select: (selected, option) => {
        return option.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace(new RegExp('>' + selected + 'option'), 'selected="selected"$&')
    },
    editIcon: (storyUser, loggedUser, storyId, floating = true) => {
        if( storyUser === loggedUser) {
            if (floating) {
                return `
                <a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red">
                    <i class="fa fa-pencil"></i>
                </a>`
            } else {
                return `
                <a href="/stories/edit/${storyId}">
                    <i class="fa fa-pencil xs"></i>
                </a>`
            }
        } else {
            return ''
        }
    }
}