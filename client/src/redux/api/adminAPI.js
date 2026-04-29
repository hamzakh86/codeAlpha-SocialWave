import { ADMIN_API, API, handleApiError } from "./utils";  // Ajout de API

export const signIn = async (credential) => {
  try {
    // MODIFICATION: Utilise API au lieu de ADMIN_API, et /users/signin
    const res = await API.post("/users/signin", credential);
    return { error: null, data: res.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getServicePreferences = async () => {
  try {
    const res = await ADMIN_API.get("/admin/preferences");
    return { error: null, data: res.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateServicePreferences = async (preferences) => {
  try {
    await ADMIN_API.put("/admin/preferences", preferences);
  } catch (error) {
    return handleApiError(error);
  }
};

export const getLogs = async () => {
  try {
    const res = await ADMIN_API.get("/admin/logs");
    return { error: null, data: res.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteLogs = async () => {
  try {
    await ADMIN_API.delete("/admin/logs");
  } catch (error) {
    return handleApiError(error);
  }
};

export const getCommunities = async () => {
  try {
    const res = await ADMIN_API.get("/admin/communities");
    return { error: null, data: res.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getCommunity = async (communityId) => {
  try {
    const res = await ADMIN_API.get(`/admin/community/${communityId}`);
    return { error: null, data: res.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getModerators = async () => {
  try {
    const res = await ADMIN_API.get("/admin/moderators");
    return { error: null, data: res.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const addModerator = async (communityId, moderatorId) => {
  try {
    await ADMIN_API.patch("/admin/add-moderators", null, {
      params: { communityId, moderatorId },
    });
  } catch (error) {
    return handleApiError(error);
  }
};

export const removeModerator = async (communityId, moderatorId) => {
  try {
    await ADMIN_API.patch("/admin/remove-moderators", null, {
      params: { communityId, moderatorId },
    });
  } catch (error) {
    return handleApiError(error);
  }
};
