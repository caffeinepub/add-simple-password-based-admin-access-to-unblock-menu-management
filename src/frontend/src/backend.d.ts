import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type FoodItemId = string;
export interface Category {
    id: CategoryId;
    order: bigint;
    name: string;
    enabled: boolean;
}
export interface AnalyticsData {
    activeItems: bigint;
    totalCategories: bigint;
    totalItems: bigint;
}
export interface FoodItem {
    id: FoodItemId;
    hot: boolean;
    categoryId: CategoryId;
    order: bigint;
    name: string;
    description: string;
    enabled: boolean;
    image?: ExternalBlob;
    price: number;
}
export type CategoryId = string;
export interface UserProfile {
    name: string;
    email?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(name: string, order: bigint): Promise<CategoryId>;
    addFoodItem(name: string, description: string, price: number, hot: boolean, categoryId: CategoryId, order: bigint): Promise<FoodItemId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCategory(id: CategoryId): Promise<void>;
    deleteFoodItem(id: FoodItemId): Promise<void>;
    getAllFoodItems(): Promise<Array<FoodItem>>;
    getAnalytics(): Promise<AnalyticsData>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getFoodItemsForCategory(categoryId: CategoryId): Promise<Array<FoodItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    reorderCategories(newOrder: Array<CategoryId>): Promise<void>;
    reorderFoodItems(newOrder: Array<FoodItemId>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleCategoryEnabled(id: CategoryId, enabled: boolean): Promise<void>;
    toggleFoodItemEnabled(id: FoodItemId, enabled: boolean): Promise<void>;
    updateCategory(id: CategoryId, name: string): Promise<void>;
    updateFoodItem(id: FoodItemId, name: string, description: string, price: number, hot: boolean, categoryId: CategoryId): Promise<void>;
    updateFoodItemImage(id: FoodItemId, newImage: ExternalBlob | null): Promise<void>;
}
