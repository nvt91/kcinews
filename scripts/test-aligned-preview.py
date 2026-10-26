#!/usr/bin/env python3
import importlib.util
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location('alignment',Path(__file__).with_name('align-kci-audio.py'))
a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)

class EditTests(unittest.TestCase):
    def test_two_frame_handles(self):
        words=[{'start':0.,'end':1.},{'start':1.5,'end':2.}]
        cuts,exceptions=a.protected_cuts([(1.,1.5)],words,2.,30.)
        self.assertEqual(len(cuts),1);self.assertFalse(exceptions)
        self.assertAlmostEqual(cuts[0]['start'],1+2/30,places=5)
        self.assertAlmostEqual(cuts[0]['end'],1.5-2/30,places=5)
    def test_never_cut_word(self):
        cuts,exceptions=a.protected_cuts([(1.,1.5)],[{'start':.9,'end':1.6}],2.,30.)
        self.assertFalse(cuts);self.assertIn('word-overlap',exceptions[0]['reason'])
    def test_short_gap_not_removed(self):
        cuts,_=a.protected_cuts([(1.,1.14)],[],2.,30.)
        self.assertFalse(cuts)
    def test_handles_protect_small_gap(self):
        cuts,exceptions=a.protected_cuts([(1.,1.16)],[],2.,30.)
        self.assertFalse(cuts);self.assertTrue(exceptions)
    def test_kept_ranges(self):
        self.assertEqual(a.keep_ranges([{'start':1.,'end':1.3}],2.),[(0.,1.),(1.3,2.)])
    def test_invalid_overlapping_edits(self):
        with self.assertRaises(ValueError): a.keep_ranges([{'start':1.,'end':2.},{'start':1.5,'end':2.1}],3.)
    def test_unicode_phrase(self):
        w=[{'word':'Dầu','start':0,'end':.1},{'word':'Brent,','start':.1,'end':.3}]
        self.assertEqual(a.locate(w,'dầu brent'),w)
    def test_missing_phrase_not_invented(self):
        with self.assertRaises(ValueError):a.locate([{'word':'Fed','start':0,'end':.2}],'Ngân hàng')
    def test_repeated_occurrence(self):
        w=[{'word':'Fed','start':0,'end':.2},{'word':'Fed','start':1,'end':1.2}]
        self.assertEqual(a.locate(w,'Fed',1)[0]['start'],1)
    def test_empty_trigger_rejected(self):
        with self.assertRaises(ValueError):a.locate([], '')

if __name__=='__main__': unittest.main()
