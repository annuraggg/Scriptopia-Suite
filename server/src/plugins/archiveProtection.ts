import { Schema } from "mongoose";

export function archiveProtectionPlugin(schema: Schema) {
  schema.pre("save", function (this: any, next) {
    if (
      !this.isNew &&
      this.isArchived &&
      this.isModified() &&
      !this.isModified("isArchived") && !this.isModified("deletedAt")
    ) {
      return next(new Error("Cannot modify an archived document."));
    }
    next();
  });

  schema.pre("updateOne", function (this: any, next) {
    const update = this.getUpdate();
    if (!update) return next();

    if (update.$set?.isArchived === true) {
      return next();
    }

    if (update.isArchived === true || update.$set?.isArchived === true) {
      return next();
    }

    this.model.findOne(this.getQuery()).then((doc: any) => {
      if (doc?.isArchived) {
        return next(new Error("Cannot update an archived document."));
      }
      next();
    });
  });

  schema.pre("findOneAndUpdate", function (this: any, next) {
    const update = this.getUpdate();
    if (!update) return next();

    if (update.$set?.isArchived === true || update.isArchived === true) {
      return next();
    }

    this.model.findOne(this.getQuery()).then((doc: any) => {
      if (doc?.isArchived) {
        return next(new Error("Cannot update an archived document."));
      }
      next();
    });
  });
}
