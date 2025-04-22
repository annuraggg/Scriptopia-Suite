import { Schema, Model } from "mongoose";

export function softDeletePlugin(schema: Schema) {
  schema.add({ deletedAt: { type: Date, default: null } });

  schema.methods.softDelete = function (this: any) {
    this.deletedAt = new Date();
    return this.save();
  };

  schema.statics.findActive = function (this: Model<any>, filter = {}) {
    return this.find({ ...filter, deletedAt: null });
  };

  schema.statics.findWithDeleted = function (this: Model<any>, filter = {}) {
    return this.find(filter);
  };

  schema.methods.delete = async function (this: any) {
    return this.softDelete();
  };

  schema.statics.deleteMany = async function (this: Model<any>, filter: any) {
    const documents = await this.find(filter);
    const promises = documents.map((doc) => doc.softDelete());
    return Promise.all(promises);
  };

  schema.statics.findByIdAndDelete = async function (
    this: Model<any>,
    id: any
  ) {
    const document = await this.findById(id);
    if (document) {
      return document.softDelete();
    }
    return null;
  };

  const autoExcludeDeleted = function (this: any, next: any) {
    this.where({ deletedAt: null });
    next();
  };

  schema.pre("find", autoExcludeDeleted);
  schema.pre("findOne", autoExcludeDeleted);
  schema.pre("findOne", function (next) {
    if (this.getQuery()._id) {
      this.where({ deletedAt: null });
    }
    next();
  });
}
