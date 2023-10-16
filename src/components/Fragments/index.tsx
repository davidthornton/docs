import FilterChildren from '../FilterChildren';
import { useLastUpdatedDatesContext } from '../LastUpdatedProvider';
import { Flex } from '@aws-amplify/ui-react';

type MdxFrontmatterType = {
  lastUpdated: string;
};

export default function Fragments({ fragments }) {
  const children: React.ReactNode[] = [];
  let frontmatter: MdxFrontmatterType;

  const { state, dispatch } = useLastUpdatedDatesContext();

  for (const key in fragments) {
    const fragment = fragments[key]([]);
    frontmatter = fragment.props.frontmatter;

    if (frontmatter && frontmatter.lastUpdated) {
      if (
        state.files[key] === undefined ||
        (state.files[key] &&
          !state.files[key].includes(frontmatter.lastUpdated))
      ) {
        dispatch({
          type: 'update',
          key: key,
          lastUpdated: frontmatter.lastUpdated
        });
      }
    }

    children.push(
      <Flex key={key} direction="column">
        {fragment}
      </Flex>
    );
  }

  return <FilterChildren>{children}</FilterChildren>;
}
