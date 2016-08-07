'use strict';

function createdModified(schema) {

	schema.virtual('updatedAtISO').get(function createdModifiedVirtualupdatedAtISO() {
		return new Date(this.updatedAt).toISOString();
	});

	schema.virtual('createdAtISO').get(function createdModifiedVirtualCreatedAtISO() {
		return new Date(this.createdAt).toISOString();
	});

	schema.set('toJSON', {
		getters: true,
		virtuals: true
	});

	schema.options.toJSON.transform = function(doc, ret) {
		delete ret._id;
		delete ret.__v;
		return ret;
	};

}

module.exports = createdModified;
