use slotmap::{SecondaryMap, SlotMap};

// https://stackoverflow.com/questions/47773849/borrow-two-mutable-values-from-the-same-hashmap
pub(crate) trait GivesMutPairForSlotmapKeys<K: Eq + slotmap::Key, V> {
    fn get_mut_pair(&mut self, a: &K, b: &K) -> (&mut V, &mut V);
}

impl<K: slotmap::Key, V> GivesMutPairForSlotmapKeys<K, V> for SlotMap<K, V> {
    fn get_mut_pair(&mut self, a: &K, b: &K) -> (&mut V, &mut V) {
        let a = self.get_mut(*a).unwrap() as *mut _;
        let b = self.get_mut(*b).unwrap() as *mut _;
        assert_ne!(a, b, "The two keys must not resolve to the same value");
        unsafe { (&mut *a, &mut *b) }
    }
}

impl<K: slotmap::Key, V> GivesMutPairForSlotmapKeys<K, V> for SecondaryMap<K, V> {
    fn get_mut_pair(&mut self, a: &K, b: &K) -> (&mut V, &mut V) {
        let a = self.get_mut(*a).unwrap() as *mut _;
        let b = self.get_mut(*b).unwrap() as *mut _;
        assert_ne!(a, b, "The two keys must not resolve to the same value");
        unsafe { (&mut *a, &mut *b) }
    }
}
