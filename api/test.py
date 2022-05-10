
import zlib


dictionary = b'e';


compressor = zlib.compressobj(wbits=-zlib.MAX_WBITS, zdict=dictionary);
compressor.compress("Eeeee");