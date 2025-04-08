interface ProfileData {
    name: string;
    status?: string;
    gender?: string;
    age?: string;
    thumbnailUrl?: string;
}

export function checkProfileComplete(profileData: ProfileData) {
    return !!(
        profileData.name &&
        profileData.status &&
        profileData.gender &&
        profileData.age &&
        profileData.name.trim() !== '' &&
        profileData.status.trim() !== '' &&
        profileData.gender.trim() !== '' &&
        profileData.age.trim() !== ''
    );
}
