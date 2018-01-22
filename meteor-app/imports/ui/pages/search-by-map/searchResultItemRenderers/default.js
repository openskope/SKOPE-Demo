import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import marked from 'marked';
import geojsonExtent from 'geojson-extent';
import {
  Card,
  CardActions,
  CardHeader,
  CardText,
} from 'material-ui/Card';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle,
} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import MapView from '/imports/ui/components/mapview';
import Badge from 'material-ui/Badge';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import DownloadIcon from 'material-ui/svg-icons/file/cloud-download';
import MapIcon from 'material-ui/svg-icons/maps/map';
import ChartIcon from 'material-ui/svg-icons/editor/multiline-chart';

import {
  absoluteUrl,
} from '/imports/ui/helpers';

/**
 * This function resets all the temporal unit fields outside of the precision to their corresponding zero points.
 * @param {Date} date
 * @param {number} precision
 * @return {Date}
 */
const getDateAtPrecision = (
  (precisions) =>
    (date, precision) =>
      precisions.reduce((acc, { handler, zeroPoint }, index) => {
        // Only need to run precision handlers larger than precision.
        if (index <= precision) {
          return acc;
        }

        const newDate = new Date(date);

        handler.call(newDate, zeroPoint);

        return newDate;
      }, date)
)([
  {
    handler: Date.prototype.setFullYear,
    zeroPoint: 0,
  },
  {
    handler: Date.prototype.setMonth,
    zeroPoint: 0,
  },
  {
    handler: Date.prototype.setDate,
    zeroPoint: 1,
  },
  {
    handler: Date.prototype.setHours,
    zeroPoint: 0,
  },
  {
    handler: Date.prototype.setMinutes,
    zeroPoint: 0,
  },
  {
    handler: Date.prototype.setSeconds,
    zeroPoint: 0,
  },
  {
    handler: Date.prototype.setMilliseconds,
    zeroPoint: 0,
  },
]);

const toolbarItemMargins = {
  margin: '0 8px 0 0',
};

const toolbarItemReverseMargins = {
  margin: '0 0 0 8px',
};

const actionButtonStyles = {
  style: {
    ...toolbarItemReverseMargins,
  },
  labelStyle: {
    textTransform: 'none',
  },
};

const SimpleToolbar = (props) => (
  <Toolbar
    noGutter
    {...props}
    style={{
      background: 'transparent',
      ...props.style,
    }}
  >{props.children}</Toolbar>
);

const GreenTickmarkBadge = (props) => (
  <Badge
    badgeContent={<CheckIcon style={{ color: 'green' }} />}
    {...props}
    badgeStyle={{
      top: '4px',
      right: '4px',
      width: '18px',
      height: '18px',
      background: 'transparent',
      pointerEvents: 'none',
      ...props.badgeStyle,
    }}
    style={{
      padding: 0,
      ...props.style,
    }}
  >{props.children}</Badge>
);

export default class SearchResultItem extends React.PureComponent {

  static propTypes = {
    result: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      _source: PropTypes.object.isRequired,
    }).isRequired,
  };

  static getDateRange (start, end) {
    if (!start && !end) {
      return '';
    }

    return [start, end]
    .map((s) => (s && moment(s).format('YYYY-MM-DD')) || '')
    .join(' - ');
  }

  static buildGeoJsonWithGeometry (geometry) {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry,
        },
      ],
    };
  }

  render () {
    const {
      result: {
        _id,
        _source: {
          // Title: title,
          // Creator,
          // CreationDate,
          // Status,
          // Rating,
          // ResultTypes,
          // StartDate,
          // EndDate,
          // Inputs,
          // Info,
          // Reference,
          Area,
        },
      },
    } = this.props;

    //! Fake data for implementing the view.
    const fakeData = {
      datasetId: 'abcdefg',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac viverra ipsum. Maecenas efficitur sodales massa id vulputate. Ut non eros sodales neque elementum suscipit in vel sapien. Vivamus ut enim neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean mauris est, luctus vehicula turpis non, rhoncus aliquam neque. Ut quis auctor purus. Morbi pellentesque id diam in viverra. Phasellus vel accumsan erat. Nunc mollis accumsan arcu vitae laoreet. Mauris aliquam lectus arcu, nec efficitur magna fermentum vitae. Suspendisse quis erat est. Proin non ante nisi.',
      revisionDate: new Date(2010, 6, 3),
      authors: [
        'Person A',
        'Person B',
        'Person C',
        'Person D',
      ],
      thumbnailUrl: '',
      spatialBoundary: null,
      dataTemporalRange: {
        gte: new Date(5, 1, 1),
        lt: new Date(2010, 6, 3),
      },
      // 0: year, 1: month, 2: day, 3: hour, 4: minute, 5: second, 6: millisecond
      dataTemporalRangePrecision: 0,
      fullDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac viverra ipsum. Maecenas efficitur sodales massa id vulputate. Ut non eros sodales neque elementum suscipit in vel sapien. Vivamus ut enim neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean mauris est, luctus vehicula turpis non, rhoncus aliquam neque. Ut quis auctor purus. Morbi pellentesque id diam in viverra. Phasellus vel accumsan erat. Nunc mollis accumsan arcu vitae laoreet. Mauris aliquam lectus arcu, nec efficitur magna fermentum vitae. Suspendisse quis erat est. Proin non ante nisi.

Praesent volutpat, urna a gravida pretium, metus erat molestie neque, non venenatis massa metus ut neque. Donec sed condimentum ipsum, id fermentum urna. Nunc eu urna laoreet elit venenatis pulvinar. Curabitur at leo aliquam, fringilla orci et, ornare nunc. In consectetur commodo lorem, eu consequat dui. Vestibulum ornare id nibh eget consequat. Curabitur tempor iaculis purus vel pulvinar.

Suspendisse consequat, leo et fringilla egestas, ligula urna convallis nisl, quis finibus erat velit eu ipsum. Nullam ultricies, nisi non pretium semper, ligula augue sagittis nulla, eget mattis ex mi tristique arcu. Integer cursus purus sit amet ipsum consequat, vitae pellentesque arcu ultrices. Vivamus posuere purus ac maximus bibendum. Suspendisse molestie vel massa non ultrices. Duis a risus arcu. Vivamus nec orci erat. Aenean congue diam tincidunt massa volutpat, quis placerat quam feugiat.

In hendrerit convallis porttitor. Suspendisse gravida massa sapien, sit amet eleifend velit sollicitudin placerat. Sed nec sodales arcu. Morbi non nisl sollicitudin mi condimentum feugiat. Donec non blandit augue. Nulla placerat convallis cursus. Nullam sagittis metus sit amet nisi varius, non aliquam purus porttitor. Morbi risus lorem, aliquet nec ullamcorper at, fringilla et justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi non ultrices ligula, gravida egestas augue. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris consectetur tortor nec eros molestie, mollis egestas eros dictum. Nam consectetur eleifend velit, vitae ullamcorper libero accumsan sed. Nunc facilisis enim neque, ut vehicula leo pulvinar vel. In congue, augue nec sollicitudin varius, sapien dui pharetra metus, vel mollis quam augue ac libero. Vestibulum urna odio, elementum et libero a, dapibus placerat libero.

Nullam velit erat, accumsan sollicitudin congue vel, iaculis vitae odio. Sed non mauris aliquam lacus congue consectetur nec vitae arcu. Donec tempor gravida ex, vitae varius metus aliquet vitae. Nulla pharetra dui nec eros dapibus aliquam. Nullam convallis condimentum cursus. Vivamus a tristique nibh, vel dictum leo. Fusce lacus diam, pellentesque a ligula non, efficitur interdum quam. Mauris volutpat tristique est, vel dapibus arcu scelerisque sit amet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`,
      dataTypes: [
        'Data Type A',
        'Data Type B',
        'Data Type C',
      ],
      keywords: [
        'Keyword A',
        'Keyword B',
        'Keyword C',
        'Keyword D',
        'Keyword E',
      ],
      metadata: {
        foo: 1,
        bar: 2,
        par: 3,
      },
    };

    const {
      title,
      revisionDate,
      authors,
      fullDescription,
      dataTypes,
      keywords,
    } = fakeData;

    const boundaryGeoJson = Area && this.constructor.buildGeoJsonWithGeometry(Area);
    const boundaryGeoJsonString = boundaryGeoJson && JSON.stringify(boundaryGeoJson);
    const boundaryExtent = geojsonExtent(boundaryGeoJson);

    // const subtitle = this.constructor.getDateRange(StartDate, EndDate);
    const revisionDateString = moment(revisionDate).format('YYYY-MM-DD');
    const subtitle = `Revised: ${revisionDateString}`;

    //! Make sure all the dangerous tags are sanitized.
    const fullDescriptionHTML = marked(fullDescription);
    //! dangerouslySetInnerHTML={{ __html: fullDescriptionHTML }}

    const blockTextFieldZoomFactor = 0.8;
    const blockTextFieldStyles = {
      root: {
        display: 'block',
        width: 'auto',
        marginTop: -10,
        //! Should not set height. It needs to be calculated automatically.
        // height: 72 * blockTextFieldZoomFactor,
        // fontSize: `${1 * blockTextFieldZoomFactor}em`,
      },
      label: {
        // top: 38 * blockTextFieldZoomFactor,
      },
      input: {
        // marginTop: 14 * blockTextFieldZoomFactor,
        // This seems to only affect the textarea.
        // lineHeight: `${24 * blockTextFieldZoomFactor}px`,
      },
      underline: {
        //
      },
    };

    // List of available features to be displayed as small feature icons.
    const availableFeatures = [
      {
        featureName: 'Download',
        IconComponent: DownloadIcon,
      },
      {
        featureName: 'Map',
        IconComponent: MapIcon,
      },
      {
        featureName: 'Charts',
        IconComponent: ChartIcon,
      },
    ];

    return (
      <Card
        className="search-result-item"
        style={{
          width: '100%',
        }}
      >
        <CardHeader
          textStyle={{
            display: 'block',
          }}
          title={title}
          titleStyle={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          subtitle={subtitle}
          showExpandableButton
        />

        <CardText
          className="search-result-item__content"
          style={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <div
            className="search-result-item__thumbnail"
            style={{
              backgroundImage: 'url(//www.openskope.org/wp-content/uploads/2016/02/ScreenShot001.bmp)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >{boundaryGeoJson && (
            <MapView
              basemap="osm"
              projection="EPSG:4326"
              extent={boundaryExtent}
              style={{
                width: '100%',
                height: '100%',
              }}
            ><map-layer-geojson src-json={boundaryGeoJsonString} /></MapView>
          )}</div>

          <div className="search-result-item__metadata">
            <TextField
              floatingLabelText="Authors"
              value={authors.join(', ')}
              style={blockTextFieldStyles.root}
              floatingLabelStyle={blockTextFieldStyles.label}
              inputStyle={blockTextFieldStyles.input}
              underlineStyle={blockTextFieldStyles.underline}
            />

            <TextField
              floatingLabelText="Description"
              value={fullDescription}
              multiLine
              rows={3}
              rowsMax={3}
              style={blockTextFieldStyles.root}
              floatingLabelStyle={blockTextFieldStyles.label}
              inputStyle={blockTextFieldStyles.input}
              underlineStyle={blockTextFieldStyles.underline}
            />

            <TextField
              floatingLabelText="Datatypes"
              value={dataTypes.join(', ')}
              style={blockTextFieldStyles.root}
              floatingLabelStyle={blockTextFieldStyles.label}
              inputStyle={blockTextFieldStyles.input}
              underlineStyle={blockTextFieldStyles.underline}
            />

            <TextField
              floatingLabelText="Keywords"
              value={keywords.join(', ')}
              style={blockTextFieldStyles.root}
              floatingLabelStyle={blockTextFieldStyles.label}
              inputStyle={blockTextFieldStyles.input}
              underlineStyle={blockTextFieldStyles.underline}
            />
          </div>
        </CardText>

        <CardActions>
          <SimpleToolbar>
            <ToolbarGroup>
              {availableFeatures.map(({
                featureName,
                IconComponent,
              }, index) => (
                <GreenTickmarkBadge
                  key={`feature__${index}`}
                  style={{
                    ...toolbarItemMargins,
                  }}
                >
                  <IconButton
                    tooltip={`${featureName} available`}
                    disableTouchRipple
                    style={{
                      cursor: 'normal',
                    }}
                  >
                    <IconComponent
                      color="rgba(180, 180, 180, 0.8)"
                    />
                  </IconButton>
                </GreenTickmarkBadge>
              ))}
            </ToolbarGroup>

            <ToolbarGroup>
              <FlatButton
                label="Examine"
                href={absoluteUrl('/workspace', null, { dataset: _id })}
                target="_blank"
                {...actionButtonStyles}
              />
            </ToolbarGroup>
          </SimpleToolbar>
        </CardActions>
      </Card>
    );
  }
}
