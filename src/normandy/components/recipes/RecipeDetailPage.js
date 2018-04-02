import { Card, Col, Row } from 'antd';
import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import LoadingOverlay from 'normandy/components/common/LoadingOverlay';
import QueryRecipe from 'normandy/components/data/QueryRecipe';
import DetailsActionBar from 'normandy/components/recipes/DetailsActionBar';
import RecipeDetails from 'normandy/components/recipes/RecipeDetails';
import HistoryTimeline from 'normandy/components/recipes/HistoryTimeline';
import RevisionNotice from 'normandy/components/recipes/RevisionNotice';
import ShieldIdenticon from 'normandy/components/common/ShieldIdenticon';

import {
  getLatestRevisionIdForRecipe,
  getRecipeHistory,
} from 'normandy/state/app/recipes/selectors';
import { getRevision } from 'normandy/state/app/revisions/selectors';
import { getUrlParam, getUrlParamAsInt } from 'normandy/state/router/selectors';

@connect(state => {
  const recipeId = getUrlParamAsInt(state, 'recipeId');
  const latestRevisionId = getLatestRevisionIdForRecipe(state, recipeId, '');
  const revisionId = getUrlParam(state, 'revisionId', latestRevisionId);
  const revision = getRevision(state, revisionId, new Map());

  return {
    history: getRecipeHistory(state, recipeId, new List()),
    recipeId,
    revision,
    revisionId,
  };
})
export default class RecipeDetailPage extends React.PureComponent {
  static propTypes = {
    history: PropTypes.instanceOf(List).isRequired,
    recipeId: PropTypes.number.isRequired,
    revision: PropTypes.instanceOf(Map).isRequired,
    revisionId: PropTypes.string.isRequired,
  };

  render() {
    const { history, recipeId, revision, revisionId } = this.props;
    return (
      <div className="page-recipe-details">
        <QueryRecipe pk={recipeId} />
        <Row gutter={24}>
          <Col span={16}>
            <RevisionNotice revision={revision} />
            <Row type="flex" align="middle">
              <Col span={4}>
                <ShieldIdenticon
                  className="detail-icon"
                  seed={revision.get('identicon_seed')}
                />
              </Col>
              <Col span={20}>
                <DetailsActionBar />
              </Col>
            </Row>
            <LoadingOverlay
              requestIds={[
                `fetch-recipe-${recipeId}`,
                `fetch-revision-${revisionId}`,
              ]}
            >
              <RecipeDetails recipe={revision.get('recipe', new Map())} />
            </LoadingOverlay>
          </Col>
          <Col span={8} className="recipe-history">
            <Card className="noHovering" title="History">
              <HistoryTimeline
                history={history}
                recipeId={recipeId}
                selectedRevisionId={revisionId}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
