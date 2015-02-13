/**
 * Created by hsue on 1/26/15.
 */
(function($){
    $.widget( "custom.rangeSlider", {
        LEFT_CAP: '<div class="cap left"></div>',
        LEFT_REGION: '<div class="inactive left"></div>',
        ACTIVE_REGION: '<div class="active"></div>',
        RIGHT_REGION: '<div class="inactive right"></div>',
        RIGHT_CAP: '<div class="cap right"></div>',
        ZOOM_REGION: '<div class="zoom-region"></div>',
        LEFT_THUMB: '<span class="thumb left"></span>',
        RIGHT_THUMB: '<span class="thumb right"></span>',

        options:{
            min: 0,
            max: 100,
            left: 0,
            right: 100
        },

        _create: function(){
            var instance = this;
            this.element.addClass('range-slider');

            $(this.LEFT_CAP).appendTo(this.element);
            this.leftRegion = $(this.LEFT_REGION).appendTo(this.element);
            this.rightRegion = $(this.RIGHT_REGION).appendTo(this.element);
            $(this.RIGHT_CAP).appendTo(this.element);
            this.activeRegion = $(this.ACTIVE_REGION).appendTo(this.element);

            this.leftThumb = $(this.LEFT_THUMB).appendTo(this.element);
            this.rightThumb = $(this.RIGHT_THUMB).appendTo(this.element);

            this.leftThumb.draggable({
                axis: 'x',
                drag: function(e, ui){
                    var right = parseFloat(instance.rightThumb.css('left'));
                    if(ui.position.left <= - instance.thumbWidth/2.0 || ui.position.left >= right - instance.thumbWidth/2){
                        return false;
                    }
                    instance._adjustRegions(ui.position.left);
                    instance.element.trigger('leftChanged');
                },
                stop: function(e, ui){
                    instance.element.trigger('slideEnd');
                }
            });
            this.rightThumb.draggable({
                axis: 'x',
                drag: function(e, ui){
                    var width = instance.element.width(),
                        left = parseFloat(instance.leftThumb.css('left'));
                    if(ui.position.left >= width || ui.position.left <= left + instance.thumbWidth/2){
                        return false;
                    }

                    instance._adjustRegions(null, ui.position.left);
                    instance.element.trigger('rightChanged');
                },
                stop: function(e, ui){
                    instance.element.trigger('slideEnd');
                }
            });

            this.thumbWidth = this.leftThumb.width();

            this.factor = this.element.width() / (this.options.max - this.options.min);

            this.left(this.options.left);
            this.right(this.options.right);
        },


        _adjustRegions: function(left, right){
            var adjustedLeft, adjustedRight;
            if(left){
                this.leftThumb.css('left', left + 'px');
                adjustedLeft = left + this.thumbWidth/2.0;
                this.leftRegion.css('width', adjustedLeft + 'px');
                this.activeRegion.css('left', adjustedLeft + 'px' );

                this.options.left = adjustedLeft/this.factor + this.options.min;
            }
            else{
                left = parseFloat(this.leftThumb.css('left'));
            }

            if(right){
                this.rightThumb.css('left', right + 'px');
                adjustedRight = right + this.thumbWidth/2.0;
                this.rightRegion.css('left', adjustedRight + 'px');

                this.options.right = adjustedRight/this.factor + this.options.min;
            }
            else{
                right = parseFloat(this.rightThumb.css('left'));
            }

            if(left && right){
                this.activeRegion.css('width', (right - left) + 'px');
            }

        },

        left: function(value){
            if(value === undefined){
                return this.options.left;
            }
            this.options.left = this._constrain(value, this.options.min, this.options.right);
            this._adjustRegions(
                this._convertFromUserDomain(this.options.left),
                this._convertFromUserDomain(this.options.right)
            );

        },

        right: function(value){
            if(value === undefined){
                return this.options.right;
            }
            this.options.right = this._constrain(value, this.options.left, this.options.max);
            this._adjustRegions(
                this._convertFromUserDomain(this.options.left),
                this._convertFromUserDomain(this.options.right)
            );
        },

        _constrain: function(value, min, max){
            if(value > max){
                value = max;
            }
            else if(value < min){
                value = min;
            }
            return value;
        },

        _convertFromUserDomain: function(value){
            return (value - this.options.min) * this.factor - this.thumbWidth/2.0;
        }
    });
}(jQuery));