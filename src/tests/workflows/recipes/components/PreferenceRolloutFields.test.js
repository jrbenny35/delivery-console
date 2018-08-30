import { Map, List } from 'immutable';
import PreferenceRolloutFields, {
  RowField,
  serializePreferenceRows,
  deserializePreferenceRows,
} from 'console/workflows/recipes/components/PreferenceRolloutFields';

describe('<PreferenceRolloutFields>', () => {
  it('should work', () => {
    const props = {
      disabled: false,
      form: {},
      recipeArguments: new Map(),
    };
    const wrapper = () => shallow(<PreferenceRolloutFields {...props} />);
    expect(wrapper).not.toThrow();
    const rendered = wrapper();
    expect(rendered).toMatchSnapshot();
  });

  describe('<RowField>', () => {
    const props = {
      row: {
        name: 'name',
        type: 'string',
        value: 'Peter',
      },
    };
    const factory = (customProps = {}) => mount(<RowField {...props} {...customProps} />);

    it('should work', () => {
      const wrapper = () => shallow(<RowField {...props} />);
      expect(wrapper).not.toThrow();
      const rendered = wrapper();
      expect(rendered).toMatchSnapshot();
    });

    // it('should be possible to remove a row', () => {
    //   const props = {
    //     row: {
    //       name: 'name',
    //       type: 'string',
    //       value: 'Peter',
    //     },
    //   };

    //   // const wrapper = mount(<RowField {...props} />);
    //   const wrapper = factory();
    //   console.log(wrapper);

    //   throw 'try harder';
    //   // expect(wrapper).not.toThrow();
    //   // const rendered = wrapper();
    //   // expect(rendered).toMatchSnapshot();
    // });
  });

  describe('serializing and deserializing preferences', () => {
    it('serialize a prefsList to a list of objects', () => {
      const list = [
        Map({ preferenceName: 'name', value: 'Peter' }),
        Map({ preferenceName: 'swede', value: true }),
        Map({ preferenceName: 'kids', value: 2 }),
      ];
      const prefsList = new List(list);
      const rowList = serializePreferenceRows(prefsList);
      expect(rowList).toBeImmutableList();
      expect(rowList.get(0)).toMatchObject({
        name: 'name',
        type: 'string',
        value: 'Peter',
      });
      expect(rowList.get(1)).toMatchObject({
        name: 'swede',
        type: 'boolean',
        value: true,
      });
      expect(rowList.get(2)).toMatchObject({
        name: 'kids',
        type: 'integer',
        value: 2,
      });
      expect(rowList.size).toEqual(3);
    });

    it('should throw error on unrecognized type', () => {
      const list = [Map({ preferenceName: 'names', value: ['Peter'] })];
      const prefsList = new List(list);
      expect(() => {
        serializePreferenceRows(prefsList);
      }).toThrow('Unrecognized preference type object (Peter)');
    });

    it('should serialize a falsy prefsList to a list of 0 objects', () => {
      const rowList = serializePreferenceRows(undefined);
      expect(rowList).toBeImmutableList();
      expect(rowList.size).toEqual(0);
    });

    it('should deserialize a List of rows into a proper preferences List', () => {
      const rows = List([
        { name: 'name', type: 'string', value: 'Peter' },
        { name: 'kids', type: 'integer', value: 2 },
        { name: 'swede', type: 'boolean', value: true },
      ]);
      const prefsList = deserializePreferenceRows(rows);
      expect(prefsList).toBeImmutableList();
      expect(prefsList.get(0)).toMatchObject({
        preferenceName: 'name',
        value: 'Peter',
      });
      expect(prefsList.get(1)).toMatchObject({
        preferenceName: 'kids',
        value: 2,
      });
      expect(prefsList.get(2)).toMatchObject({
        preferenceName: 'swede',
        value: true,
      });
      expect(prefsList.size).toEqual(3);
    });
  });
});
