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
export interface Title {
    id: bigint;
    title: string;
    ratingCount: bigint;
    video: ExternalBlob;
    description: string;
    titleType: TitleType;
    averageRating: number;
    coverImage: ExternalBlob;
}
export interface TitleInput {
    title: string;
    video: ExternalBlob;
    description: string;
    titleType: TitleType;
    coverImage: ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export enum TitleType {
    movie = "movie",
    series = "series"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTitle(input: TitleInput): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteTitle(id: bigint): Promise<void>;
    getAllTitles(): Promise<Array<Title>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTitleById(id: bigint): Promise<Title>;
    getTitleRatings(titleId: bigint): Promise<{
        ratingCount: bigint;
        averageRating: number;
    } | null>;
    getTitlesByType(titleType: TitleType): Promise<Array<Title>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    rateTitle(titleId: bigint, userRating: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchTitles(search: string): Promise<Array<Title>>;
    updateTitle(id: bigint, updatedTitle: TitleInput): Promise<void>;
}
