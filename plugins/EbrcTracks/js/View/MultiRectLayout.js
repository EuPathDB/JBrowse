define(['dojo/_base/declare',
        'dojo/_base/array',
        'EbrcTracks/View/GranularRectLayout',
       ],
function (
    declare,
    array,
    Layout
) {
  return declare(null, {
    constructor(args) {
        this.pitchX = args.pitchX || 10
        this.pitchY = args.pitchY || 10

        this.displayMode = args.displayMode

        // reduce the pitchY to try and pack the features tighter
        if (this.displayMode === 'compact') {
            this.pitchY = Math.round(this.pitchY / 4) || 1
            this.pitchX = Math.round(this.pitchX / 4) || 1
        }

        this.subtracks = args.subtracks;

        var thisB = this;

        var top = 0
        var sumHeights = 0;

        this.layouts = array.map(this.subtracks, function(subtrack) {
            top = sumHeights
            subtrack.top = top * thisB.pitchY;

            var subtrackHeight = subtrack.height || 10;
            sumHeights = sumHeights + subtrackHeight;

            return new Layout({ sTop: top, pitchX: thisB.pitchX, pitchY: thisB.pitchY, displayMode: thisB.displayMode, featureFilters: subtrack.featureFilters });
        });
    },

    getLayoutForFeature(feature) {
        var rv;
        array.forEach(this.layouts, function(layout) {
            Object.keys(layout.featureFilters).forEach(function(featureFiltersKey) {
                if(feature.data[featureFiltersKey] != layout.featureFilters[featureFiltersKey]) {
                    return;
                }
                // our layout is the one where all the metadata match
                rv = layout;
            });
        });
        return rv;
    },

    addRect(id, left, right, height, feature) {
        var layout = this.getLayoutForFeature(feature);

        if(layout) {
            return layout.addRect(id, left, right, height, feature);
        }
        console.log("WARN:  Feature not sorted into subtrack... SKIPPING:" + feature.data['name']);
    },

    getTotalHeight() {
        var totalHeight = 0;
        array.forEach(this.layouts, function(layout) {
            totalHeight = totalHeight + layout.getTotalHeight();
        });
        return totalHeight
        
    },
    discardRange(left, right) {
        array.forEach(this.layouts, function(layout) {
            layout.discardRange(left, right);
        });
    },
    getByCoord(x, y) {
        var rv;
        array.forEach(this.layouts, function(layout) {
            var tmp = layout.getByCoord(x, y);
            if(tmp) {
                rv = tmp;
            }
        });

        if(rv) {
            return rv;
        }
    }

  })
})

