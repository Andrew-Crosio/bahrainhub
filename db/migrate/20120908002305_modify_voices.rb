class ModifyVoices < ActiveRecord::Migration
  def change
    change_table :voices do |t|
      t.boolean :city_or_village, :default => false
      t.boolean :media_coverage, :default => false
      t.index :city_or_village
      t.index :media_coverage
      t.index :featured
    end
  end
end
