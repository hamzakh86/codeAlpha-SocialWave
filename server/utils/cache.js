/**
 * Cache en mémoire simple avec TTL (Time-To-Live).
 * Utilisé pour mettre en cache les tokens JWT validés afin d'éviter
 * de requêter la base de données à chaque appel protégé.
 *
 * Stratégie : Map<key, { value, expiresAt }>
 * Nettoyage automatique des entrées expirées toutes les 10 minutes.
 */

class MemoryCache {
  constructor() {
    this.store = new Map();
    // Nettoyage périodique des entrées expirées (toutes les 10 min)
    this._cleanupInterval = setInterval(() => this._cleanup(), 10 * 60 * 1000);
    // Empêche le setInterval de bloquer l'arrêt du processus Node
    if (this._cleanupInterval.unref) {
      this._cleanupInterval.unref();
    }
  }

  /**
   * Stocker une valeur avec un TTL en secondes.
   * @param {string} key
   * @param {*} value
   * @param {number} ttlSeconds - Durée de vie en secondes (défaut: 5 min)
   */
  set(key, value, ttlSeconds = 300) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Récupérer une valeur. Retourne null si absente ou expirée.
   * @param {string} key
   * @returns {*|null}
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Supprimer une entrée du cache.
   * @param {string} key
   */
  del(key) {
    this.store.delete(key);
  }

  /**
   * Vérifier si une clé existe et n'est pas expirée.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Vider tout le cache.
   */
  flush() {
    this.store.clear();
  }

  /**
   * Nettoyage interne des entrées expirées.
   * @private
   */
  _cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Retourne le nombre d'entrées actuellement en cache.
   * @returns {number}
   */
  get size() {
    return this.store.size;
  }
}

// Singleton partagé dans tout le serveur
const cache = new MemoryCache();

module.exports = cache;
