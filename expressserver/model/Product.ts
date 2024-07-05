import mongoose, { Schema, Document } from 'mongoose';

interface Option {
  id: string; // Reverted back to id
  name: string;
}

interface Variant {
  id: string; // Reverted back to id
  name: string;
  options: Option[];
}

interface Media {
  id: string; // Reverted back to id
  title: string;
  url: string;
  type: string;
  isFeatured: boolean;
}

interface IProduct extends Document {
  description: string;
  variants: Variant[];
  medias: Media[];
  locationId: string;
  name: string;
  productType: string;
  availableInStore: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  statementDescriptor: string;
  image: string;
  productId: string;
  prices: Price[];
}

interface Price {
    _id: string;
    variantOptionIds: string[];
    locationId: string;
    product: string;
    userId: string;
    name: string;
    type: string;
    currency: string;
    amount: number;
    recurring?: {
      interval: string;
      intervalCount: number;
    };
    createdAt: Date;
    updatedAt: Date;
    compareAtPrice: number;
    trackInventory?: boolean;
    availableQuantity: number;
    allowOutOfStockPurchases: boolean;
  }

const optionSchema = new Schema<Option>({
  id: { type: String }, // Keeping as id
  name: { type: String }
});

const variantSchema = new Schema<Variant>({
  id: { type: String }, // Keeping as id
  name: { type: String },
  options: [optionSchema]
});

const mediaSchema = new Schema<Media>({
  id: { type: String }, // Keeping as id
  title: { type: String },
  url: { type: String },
  type: { type: String },
  isFeatured: { type: Boolean }
});

const priceSchema = new Schema<Price>({
    _id: Schema.Types.ObjectId,
    variantOptionIds: [{ type: String }],
    locationId: { type: String },
    product: { type: String },
    userId: { type: String },
    name: { type: String },
    type: { type: String },
    currency: { type: String },
    amount: { type: Number },
    recurring: {
      interval: { type: String },
      intervalCount: { type: Number },
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    compareAtPrice: { type: Number },
    trackInventory: { type: Boolean, default: null },
    availableQuantity: { type: Number },
    allowOutOfStockPurchases: { type: Boolean },
  }, { _id: false });

const productSchema = new Schema<IProduct>({
  description: { type: String },
  variants: [variantSchema],
  medias: [mediaSchema],
  prices: [priceSchema],
  locationId: { type: String },
  name: { type: String },
  productType: { type: String },
  availableInStore: { type: Boolean },
  userId: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  statementDescriptor: { type: String },
  image: { type: String },
  productId: { type: String, required: true } // productId is the only required field
});

export const Product = mongoose.model<IProduct>('Product', productSchema);